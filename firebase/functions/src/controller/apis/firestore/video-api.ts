import * as logger from "firebase-functions/logger";
import {onRequest} from "firebase-functions/v1/https";
import {defineString} from "firebase-functions/params";
import {OkResponse} from "../../../model/ok-response";
import {SecretManager} from "../../../service/secret-manager";
// prettier-ignore
import {
  VideoInsertUseCase} from "../../../service/usecases/video-insert-usecase";

/**
 * @POST
 * add video documents in "video" collection if absent
 *
 * R: 0
 * W: n
 */
export const videoinit = onRequest(async (_, res) => {
  const envVarsName = defineString("ENV_NAME").value();
  const secretVarsName = defineString("SECRET_NAME").value();
  try {
    const env = await SecretManager.setUpAsync(envVarsName);
    const youtubeDataApiKey = env.get<string>("YOUTUBE_DATA_API_KEY");
    const videoInsertUseCase = new VideoInsertUseCase(youtubeDataApiKey);
    const secret = await SecretManager.setUpAsync(secretVarsName);
    const targetVideoIds = secret.get<string[]>("TARGET_VIDEO_IDS");

    const succeeded = await videoInsertUseCase.insertIfAbsent(targetVideoIds);
    res.status(200).send(succeeded);
  } catch (err) {
    logger.error(err);
    res.status(500).send(OkResponse.NG);
  }
});
