import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import {NewsRepository} from "../repository/firestore/news-repository";
// prettier-ignore
import {
  YouTubeDataApiRepository} from "../repository/youtube/youtube-repository";
import {VideoInfoItem} from "../../model/youtube/video-info-item";
import {calculateRestDaysFor} from "../../utils/date-tool";
import {NewsDocument} from "../../model/firestore/news-document";

export class AnniversaryUseCase {
  private youtubeRepo: YouTubeDataApiRepository;
  private newsRepo: NewsRepository;
  private readonly ALMOST_THRESHOLD = 3;

  constructor(youtubeDataApiKey: string) {
    this.youtubeRepo = new YouTubeDataApiRepository(youtubeDataApiKey);
    const firestore = admin.firestore();
    this.newsRepo = new NewsRepository(firestore);
  }

  public async checkPublishedAndCelebrateAnniv(videoIds: string[]) {
    try {
      const videos: VideoInfoItem[] = await this.youtubeRepo.listVideoInfo(
        videoIds,
        ["snippet"],
      );

      const batch = this.newsRepo.startBatch();

      const almostAnnivs = videos.filter((v) =>
        this.isAnniversaryTodayOrSoon(v),
      );
      for (const video of almostAnnivs) {
        const newsDoc = new NewsDocument({
          videoId: video.id,
          videoTitle: video.snippet.title,
          category: "ANNIVERSARY",
          properties: {
            publishedAt: video.snippet.publishedAt,
            restDays: this.calculateRestDaysForAnniversary(
              video.snippet.publishedAt,
            ),
          },
        });
        this.newsRepo.addNewsWithBatch(batch, newsDoc);
      }

      await this.newsRepo.commitBatch(batch);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  private isAnniversaryTodayOrSoon(video: VideoInfoItem) {
    if (!("snippet" in video)) {
      return false;
    }
    const pubAt = video.snippet.publishedAt;
    const rest = this.calculateRestDaysForAnniversary(pubAt);
    if (rest <= this.ALMOST_THRESHOLD) {
      return true;
    }
    return false;
  }

  private calculateRestDaysForAnniversary(pubAt: string) {
    const dateOfPubAt = new Date(pubAt);
    return calculateRestDaysFor(dateOfPubAt);
  }
}
