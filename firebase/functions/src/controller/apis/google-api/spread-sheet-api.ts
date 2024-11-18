import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import {firestoreRegion} from "../../../constant/setting-value";
import {defineString} from "firebase-functions/params";
import {SecretManager} from "../../../service/secret-manager";
import {ExportSpreadSheetUseCase} from "../../../service/usecases/export-spreadsheet-usecase";
import {json} from "../../../type/types";

export const shareSheet = functions
  .region(firestoreRegion)
  .https.onRequest(async (req, res) => {
    let email: string;
    if (!req.query.email) {
      res.status(400).send("email address is not specified.");
      return;
    } else {
      email = req.query.email.toString();
    }
    const envVarsName = defineString("ENV_NAME").value();
    const env = await SecretManager.setUpAsync(envVarsName);
    const googleSheetApiKeyJson = env.get<json>("GOOGLE_SHEET_API_KEY_JSON");
    const exportSpreadSheetUseCase = new ExportSpreadSheetUseCase(
      googleSheetApiKeyJson,
      email,
    );
    try {
      await exportSpreadSheetUseCase.shareAsEditor();
      res.status(200).send();
    } catch (err) {
      logger.error(err);
      res.status(500).send(err);
    }
  });
