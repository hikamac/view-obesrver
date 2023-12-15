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

  /**
   * @deprecated
   * @param {string[]}targetVideoIds
   */
  public async insert(targetVideoIds: string[]): Promise<void> {
    const videoInfoItems = await this.fetchFromYouTube(targetVideoIds);
    await this.insertFromVideoInfoItems(videoInfoItems);
  }

  public async insertIfAbsent(targetVideoIds: string[]): Promise<string[]> {
    try {
      const exists = await this.videoRepo.getVideos();
      const existVideoIds = Object.entries(exists).map(
        ([, val]) => val.videoId,
      );
      const absents = targetVideoIds.filter(
        (id) => !existVideoIds.includes(id),
      );
      if (!absents || absents.length <= 0) {
        return [];
      }
      const targets = await this.fetchFromYouTube(absents);
      const videoDocuments: VideoDocument[] = targets
        .map((vii) => this.convert(vii))
        .filter((vd) => vd !== null) as VideoDocument[];
      await this.videoRepo.addVideos(videoDocuments);

      return videoDocuments.map((vd) => vd.videoId);
    } catch (err) {
      logger.error(err);
      throw err;
    }
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
      });
      return vd;
    } catch (err) {
      logger.error(err);
      return null;
    }
  }
}
