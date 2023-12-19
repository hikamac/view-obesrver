import * as functions from "firebase-functions";
import {defineString} from "firebase-functions/params";
import {SecretManager} from "../../service/secret-manager";
import {AnniversaryUseCase} from "../../service/usecases/anniversary-usecase";
import {firestoreRegion} from "../../constant/setting-value";

/**
 * add the notification in "news" collection
 * if the day is anniversary or soon.
 * FREQ: every 0 of days(1/d)
 *
 * R: n
 * W: n + a
 */
export const checkTheAnniversaryDay = functions
  .region(firestoreRegion)
  .pubsub.schedule("0 0 * * *")
  .timeZone("Asia/Tokyo")
  .onRun(async () => {
    const envVarsName = defineString("ENV_NAME").value();
    const secretVarsName = defineString("SECRET_NAME").value();
    const env = await SecretManager.setUpAsync(envVarsName);
    const youtubeDataApiKey = env.get<string>("YOUTUBE_DATA_API_KEY");
    const anniversaryUseCase = new AnniversaryUseCase(youtubeDataApiKey);
    const secret = await SecretManager.setUpAsync(secretVarsName);
    const targetVideoIds = secret.get<string[]>("TARGET_VIDEO_IDS");

    await anniversaryUseCase.checkPublishedAndCelebrateAnniv(targetVideoIds);
  });
