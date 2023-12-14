import * as functions from "firebase-functions";
import {SecretManager} from "../../service/secret-manager";
import {AnniversaryUseCase} from "../../service/usecases/anniversary-usecase";
import {envVarsName, secretVarsName} from "../..";

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
    const env = await SecretManager.setUpAsync(envVarsName);
    const youtubeDataApiKey = env.get<string>("YOUTUBE_DATA_API_KEY");
    const anniversaryUseCase = new AnniversaryUseCase(youtubeDataApiKey);
    const secret = await SecretManager.setUpAsync(secretVarsName);
    const targetVideoIds = secret.get<string[]>("TARGET_VIDEO_IDS");

    await anniversaryUseCase.checkPublishedAndCelebrateAnniv(targetVideoIds);
  });
