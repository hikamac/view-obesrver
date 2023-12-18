import {defineString} from "firebase-functions/params";
import {onRequest} from "firebase-functions/v2/https";
import {SecretManager} from "../../../service/secret-manager";
// prettier-ignore
import {
  AnniversaryUseCase} from "../../../service/usecases/anniversary-usecase";
import {OkResponse} from "../../../model/ok-response";

export const aniv = onRequest(async (_, res) => {
  const envVarsName = defineString("ENV_NAME").value();
  const secretVarsName = defineString("SECRET_NAME").value();
  const env = await SecretManager.setUpAsync(envVarsName);
  const youtubeDataApiKey = env.get<string>("YOUTUBE_DATA_API_KEY");
  const anniversaryUseCase = new AnniversaryUseCase(youtubeDataApiKey);
  const secret = await SecretManager.setUpAsync(secretVarsName);
  const targetVideoIds = secret.get<string[]>("TARGET_VIDEO_IDS");

  try {
    await anniversaryUseCase.checkPublishedAndCelebrateAnniv(targetVideoIds);
    res.send(OkResponse.OK);
  } catch (e) {
    res.status(500).send(e);
  }
});
