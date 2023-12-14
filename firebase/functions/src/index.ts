/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
// import {Firestore} from "firebase-admin/firestore";
import {YouTubeApiService} from "./youtube";
import {defineString} from "firebase-functions/params";
import * as functions from "firebase-functions";
import axios from "axios";
import {VideoInfoItem} from "./model/youtube/video-info-item";
import {onRequest} from "firebase-functions/v1/https";
import {OkResponse} from "./model/ok-response";
import {SecretManager} from "./service/secret-manager";
import {ViewCountUseCase} from "./service/usecases/view-count-usecase";
import {VideoInsertUseCase} from "./service/usecases/video-insert-usecase";
import {AnniversaryUseCase} from "./service/usecases/anniversary-usecase";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const options: admin.AppOptions = {};
admin.initializeApp(options);

export const envVarsName = defineString("ENV_NAME").value();
export const secretVarsName = defineString("SECRET_NAME").value();

export const testYt = functions.pubsub
  .schedule("0,30 * * * *")
  .timeZone("Asia/Tokyo")
  .onRun(async () => {
    try {
      const youtubeApiService = new YouTubeApiService();
      const targetVideoId = defineString("TARGET_VIDEO_ID");
      const videoInfo = await youtubeApiService.listVideoInfo(
        targetVideoId.value(),
      );

      const webhook = defineString("DISCORD_WEBHOOK_URL");
      const content: string = createContent(videoInfo);
      await axios.post(webhook.value(), {content: content});
      return null;
    } catch (err) {
      logger.error("error", err);
      return null;
    }
  });

/**
 * @POST
 * add video documents in "video" collection
 *
 * R: 0
 * W: n
 */
export const initializeDocument = onRequest(async (_, res) => {
  try {
    const env = await SecretManager.setUpAsync(envVarsName);
    const youtubeDataApiKey = env.get<string>("YOUTUBE_DATA_API_KEY");
    const videoInsertUseCase = new VideoInsertUseCase(youtubeDataApiKey);
    const secret = await SecretManager.setUpAsync(secretVarsName);
    const targetVideoIds = secret.get<string[]>("TARGET_VIDEO_IDS");

    await videoInsertUseCase.insert(targetVideoIds);
    res.status(200).send(OkResponse.OK);
  } catch (err) {
    logger.error(err);
    res.status(500).send(OkResponse.NG);
  }
});

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
    await fetchViewCountsAndStoreHistory();
  });

/**
 * @deprecated
 */
export const fetchViewCountsAndStoreReq = onRequest(async (_, res) => {
  try {
    await fetchViewCountsAndStoreHistory();
    res.status(200).send(OkResponse.OK);
  } catch (err) {
    res.status(500).send(OkResponse.NG);
  }
});

async function fetchViewCountsAndStoreHistory() {
  try {
    const env = await SecretManager.setUpAsync(envVarsName);
    const youtubeDataApiKey = env.get<string>("YOUTUBE_DATA_API_KEY");
    const viewCountUseCase = new ViewCountUseCase(youtubeDataApiKey);
    const secret = await SecretManager.setUpAsync(secretVarsName);
    const targetVideoIds = secret.get<string[]>("TARGET_VIDEO_IDS");

    await viewCountUseCase.fetchAndStore(targetVideoIds);
  } catch (error) {
    logger.error(error);
  }
}

/**
 * add the notification in "news" collection
 * if the day is anniversary or soon.
 * FREQ: every 0 of days(1/d)
 *
 * R: n
 * W: n + a
 */
export const checkTheAnniversaryDay = functions.pubsub
  .schedule("0 0 * * *")
  .timeZone("Asia/Tokyo")
  .onRun(async () => {
    try {
      await checkPublishedAndCelebrateAnniv();
    } catch (error) {
      logger.error(error);
    }
  });

/**
 * @deprecated
 */
export const checkTheAnniversaryDayReq = onRequest(async (_, res) => {
  try {
    await checkPublishedAndCelebrateAnniv();
    res.status(200).send(OkResponse.OK);
  } catch (err) {
    res.status(500).send(OkResponse.NG);
  }
});

async function checkPublishedAndCelebrateAnniv() {
  const env = await SecretManager.setUpAsync(envVarsName);
  const youtubeDataApiKey = env.get<string>("YOUTUBE_DATA_API_KEY");
  const anniversaryUseCase = new AnniversaryUseCase(youtubeDataApiKey);
  const secret = await SecretManager.setUpAsync(secretVarsName);
  const targetVideoIds = secret.get<string[]>("TARGET_VIDEO_IDS");

  await anniversaryUseCase.checkPublishedAndCelebrateAnniv(targetVideoIds);
}

/* */

function createContent(videoInfo: VideoInfoItem | null): string {
  if (!videoInfo) {
    return "動画情報の取得に失敗しました。";
  }
  const snippet = videoInfo.snippet;
  const statistics = videoInfo.statistics;

  return `${snippet.title}の再生回数が${statistics.viewCount}に到達しました！`;
}
