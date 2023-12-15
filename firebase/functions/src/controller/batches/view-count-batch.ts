import axios from "axios";

import * as functions from "firebase-functions";
import {defineString} from "firebase-functions/params";
import {SecretManager} from "../../service/secret-manager";
import {VideoInfoItem} from "../../model/youtube/video-info-item";
// prettier-ignore
import {
  YouTubeDataApiRepository,
} from "../../service/repository/youtube/youtube-repository";
import {ViewCountUseCase} from "../../service/usecases/view-count-usecase";

/**
 * @PUT
 * record view count of documents in "video" collection.
 * if the view count is about to reach the milestone,
 * then also add the notification in "news" collection.
 *
 * FREQ: every 10 minutes(144/d)
 *
 * R: n
 * W: n + a
 */
export const fetchViewCountsAndStore = functions.pubsub
  .schedule("0,10,20,30,40,50 * * * *")
  .timeZone("Asia/Tokyo")
  .onRun(async () => {
    const envVarsName = defineString("ENV_NAME").value();
    const secretVarsName = defineString("SECRET_NAME").value();
    try {
      const env = await SecretManager.setUpAsync(envVarsName);
      const youtubeDataApiKey = env.get<string>("YOUTUBE_DATA_API_KEY");
      const viewCountUseCase = new ViewCountUseCase(youtubeDataApiKey);
      const secret = await SecretManager.setUpAsync(secretVarsName);
      const targetVideoIds = secret.get<string[]>("TARGET_VIDEO_IDS");

      await viewCountUseCase.fetchAndStore(targetVideoIds);
    } catch (error) {
      functions.logger.error(error);
    }
  });

export const testYt = functions.pubsub
  .schedule("0,30 * * * *")
  .timeZone("Asia/Tokyo")
  .onRun(async () => {
    try {
      const envVarsName = defineString("ENV_NAME").value();
      const secretVarsName = defineString("SECRET_NAME").value();
      const env = await SecretManager.setUpAsync(envVarsName);
      const youtubeDataApiKey = env.get<string>("YOUTUBE_DATA_API_KEY");
      const secret = await SecretManager.setUpAsync(secretVarsName);
      const targetVideoIds = secret.get<string[]>("TARGET_VIDEO_IDS");

      const youtube = new YouTubeDataApiRepository(youtubeDataApiKey);
      const videoInfoItem = await youtube.listVideoInfo(targetVideoIds, [
        "snippet",
        "statistics",
      ]);

      let content = "";

      const webhook = defineString("DISCORD_WEBHOOK_URL");
      for (const video of videoInfoItem) {
        content += createContent(video) + "\n";
      }

      await axios.post(webhook.value(), {content: content});
    } catch (err) {
      functions.logger.error("error", err);
    }
  });

function createContent(videoInfo: VideoInfoItem | null): string {
  if (!videoInfo) {
    return "動画情報の取得に失敗しました。";
  }
  const snippet = videoInfo.snippet;
  const statistics = videoInfo.statistics;

  return `${snippet.title}の再生回数が${statistics.viewCount}に到達しました！`;
}
