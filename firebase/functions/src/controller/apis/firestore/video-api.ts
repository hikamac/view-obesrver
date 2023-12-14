import * as logger from "firebase-functions/logger";
import {onRequest} from "firebase-functions/v1/https";
import {envVarsName, secretVarsName} from "../../..";
import {OkResponse} from "../../../model/ok-response";
import {SecretManager} from "../../../service/secret-manager";
import {VideoInsertUseCase} from "../../../service/usecases/video-insert-usecase";

/**
 * @POST
 * add video documents in "video" collection
 *
 * R: 0
 * W: n
 */
export const videoinit = onRequest(async (_, res) => {
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
