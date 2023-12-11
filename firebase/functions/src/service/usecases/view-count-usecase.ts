import * as admin from "firebase-admin";
import {NewsRepository} from "../repository/firestore/news-repository";
import {VideoRepository} from "../repository/firestore/video-repository";
import {Transaction} from "firebase-admin/firestore";
import {
  VideoDocument,
  ViewHistory,
  isCloseToNextMilestone,
} from "../../model/firestore/video-document";

export class ViewCountUseCase {
  private firestore: admin.firestore.Firestore;
  private videoRepo: VideoRepository;
  private newsRepo: NewsRepository;
  constructor() {
    this.firestore = admin.firestore();
    this.videoRepo = new VideoRepository(this.firestore);
    this.newsRepo = new NewsRepository(this.firestore);
  }

  public async updateVideoAndCreateNewsIfNeeded(
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
          // TODO: celebrate exceed milestone
          // TODO: set new milestone
        } else if (isCloseToNextMilestone(viewCount)) {
          // TODO: notify being close to the milestone
        }
        // add sub documents under each video document
        const viewHistory = new ViewHistory({viewCount: viewCount});
        await this.videoRepo.addViewHistoryInTx(tx, docId, viewHistory);
      }
    });
  }
}
