import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import {VideoRepository} from "../repository/firestore/video-repository";
import {VideoInfoItem} from "../../model/youtube/video-info-item";
import {
  VideoDocument,
  calcMilestone,
} from "../../model/firestore/video-document";
import {FieldValue, Timestamp} from "firebase-admin/firestore";
// prettier-ignore
import {
  YouTubeDataApiRepository} from "../repository/youtube/youtube-repository";
export class VideoInsertUseCase {
  private youtubeRepo: YouTubeDataApiRepository;
  private firestore: admin.firestore.Firestore;
  private videoRepo: VideoRepository;
  constructor(youtubeDataApiKey: string) {
    this.youtubeRepo = new YouTubeDataApiRepository(youtubeDataApiKey);
    this.firestore = admin.firestore();
    this.videoRepo = new VideoRepository(this.firestore);
  }

  public async insert(targetVideoIds: string[]): Promise<void> {
    const videoInfoItems = await this.fetchFromYouTube(targetVideoIds);
    await this.insertFromVideoInfoItems(videoInfoItems);
  }

  private async fetchFromYouTube(
    targetVideoIds: string[],
  ): Promise<VideoInfoItem[]> {
    const videoInfos = await this.youtubeRepo.listVideoInfo(targetVideoIds, [
      "snippet",
      "statistics",
    ]);
    return videoInfos;
  }

  private async insertFromVideoInfoItems(
    videoInfoItems: VideoInfoItem[],
  ): Promise<void> {
    const videoDocuments: VideoDocument[] = videoInfoItems
      .map((vii) => this.convert(vii))
      .filter((vd) => vd !== null) as VideoDocument[];
    const result = await this.videoRepo.addVideos(videoDocuments);
    logger.info("result: " + result);
  }

  private convert(videoInfoItem: VideoInfoItem): VideoDocument | null {
    try {
      const now = FieldValue.serverTimestamp();
      const publishedAtDate = new Date(videoInfoItem.snippet.publishedAt);
      const publishedAt = Timestamp.fromDate(publishedAtDate);
      const milestone = calcMilestone(
        Number(videoInfoItem.statistics.viewCount),
      );
      const vd = new VideoDocument({
        videoId: videoInfoItem.id,
        title: videoInfoItem.snippet.title,
        updated: now,
        channelId: videoInfoItem.snippet.channelId,
        publishedAt: publishedAt,
        milestone: milestone,
        isApprNewsed: false,
      });
      return vd;
    } catch (err) {
      logger.error(err);
      return null;
    }
  }
}
