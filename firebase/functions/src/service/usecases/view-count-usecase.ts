import * as admin from "firebase-admin";
import {NewsRepository} from "../repository/firestore/news-repository";
import {VideoRepository} from "../repository/firestore/video-repository";
import {Transaction} from "firebase-admin/firestore";
import {
  VideoDocument,
  ViewHistory,
  calcMilestone,
  isCloseToNextMilestone,
} from "../../model/firestore/video-document";
import {NewsDocument, NewsCategory} from "../../model/firestore/news-document";
// prettier-ignore
import {
  YouTubeDataApiRepository,
} from "../repository/youtube/youtube-repository";

export class ViewCountUseCase {
  private youtubeRepo: YouTubeDataApiRepository;
  private firestore: admin.firestore.Firestore;
  private videoRepo: VideoRepository;
  private newsRepo: NewsRepository;
  constructor(youtubeDataApiKey: string) {
    this.youtubeRepo = new YouTubeDataApiRepository(youtubeDataApiKey);
    this.firestore = admin.firestore();
    this.videoRepo = new VideoRepository(this.firestore);
    this.newsRepo = new NewsRepository(this.firestore);
  }

  public async fetchAndStore(targetVideoIds: string[]) {
    const videoIdAndViewCounts =
      await this.fetchViewCountsFromYouTube(targetVideoIds);
    await this.updateVideoAndCreateNewsIfNeeded(videoIdAndViewCounts);
  }

  private async fetchViewCountsFromYouTube(
    targetVideoIds: string[],
  ): Promise<Record<string, number>> {
    const videoInfos = await this.youtubeRepo.listVideoInfo(targetVideoIds, [
      "statistics",
    ]);
    return videoInfos.reduce(
      (pre, cur) => {
        pre[cur.id] = Number(cur.statistics.viewCount);
        return pre;
      },
      {} as Record<string, number>,
    );
  }

  private async updateVideoAndCreateNewsIfNeeded(
    videoIdAndViewCounts: Record<string, number>,
  ): Promise<void> {
    this.firestore.runTransaction(async (tx: Transaction) => {
      const documentIdAndDocument: Record<string, VideoDocument> =
        await this.videoRepo.getByVideoIdsInTx(
          tx,
          Object.keys(videoIdAndViewCounts),
        );

      for (const [docId, doc] of Object.entries(documentIdAndDocument)) {
        // update video document and create news
        const viewCount = videoIdAndViewCounts[doc.videoId];
        if (viewCount >= doc.milestone) {
          await this.celebrateReaching(
            tx,
            doc.videoId,
            doc.title,
            viewCount,
            doc.milestone,
          );
          await this.setNewMilestone(tx, docId, doc, viewCount);
        } else if (isCloseToNextMilestone(viewCount)) {
          await this.notifyApproacingMilestone(
            tx,
            doc.videoId,
            doc.title,
            viewCount,
            doc.milestone,
          );
        }
        // add sub documents under each video document
        const viewHistory = new ViewHistory({viewCount: viewCount});
        await this.videoRepo.addViewHistoryInTx(tx, docId, viewHistory);
      }
    });
  }

  private async setNewMilestone(
    tx: Transaction,
    docId: string,
    oldDoc: VideoDocument,
    viewCount: number,
  ): Promise<void> {
    const newVideoDoc = {
      ...oldDoc,
      milestone: calcMilestone(viewCount),
    } as VideoDocument;
    newVideoDoc.setUpdatedNow();
    await this.videoRepo.updateVideoInTx(tx, docId, newVideoDoc);
  }

  private async celebrateReaching(
    tx: Transaction,
    videoId: string,
    videoTitle: string,
    viewCount: number,
    oldMilestone: number,
  ): Promise<void> {
    const category = NewsCategory.VIEW_COUNT_REACHED;
    const newsDoc = new NewsDocument({
      videoId: videoId,
      videoTitle: videoTitle,
      category: category,
      properties: {
        viewCount: viewCount,
        milestone: oldMilestone,
      },
    });
    const docId = this.generateNewsDocumentId(category, videoId);
    await this.newsRepo.setNewsInTx(tx, docId, newsDoc);
  }

  private async notifyApproacingMilestone(
    tx: Transaction,
    videoId: string,
    videoTitle: string,
    viewCount: number,
    currentMilestone: number,
  ): Promise<void> {
    const category = NewsCategory.VIEW_COUNT_APPROACH;
    const newsDoc = new NewsDocument({
      videoId: videoId,
      videoTitle: videoTitle,
      category: category,
      properties: {
        viewCount: viewCount,
        milestone: currentMilestone,
      },
    });
    const docId = this.generateNewsDocumentId(category, videoId);
    await this.newsRepo.setNewsInTx(tx, docId, newsDoc);
  }

  private generateNewsDocumentId(
    category: NewsCategory,
    videoId: string,
  ): string {
    return `${category}-${videoId}`;
  }
}
