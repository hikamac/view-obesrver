import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import {firestoreRegion} from "../../constant/setting-value";
import {defineString} from "firebase-functions/params";
import {SecretManager} from "../../service/secret-manager";
// prettier-ignore
import {ExportSpreadSheetUseCase}
  from "../../service/usecases/export-spreadsheet-usecase";
import {json} from "../../type/types";

/**
 * Export documents in "view-history" subcollection.
 *
 * FREQ: per 4 days.
 *
 * R: videoDocs * 6 * 24 * 4
 * W: 0
 * D: videoDocs * 6 * 24 * 4
 */
export const exportSpreadSheet = functions
  .region(firestoreRegion)
  .pubsub.schedule("0, 4, 1, *, *")
  .timeZone("Asia/Tokyo")
  .onRun(async () => {
    logger.info("export spread sheet batch started.");
    await exportToSpreadSheet(65, 60);
    logger.info("export spread sheet batch finished.");
  });

/**
 * Export documents in "view-history" subcollection
 * more rapidly to catch up the ordinal cycle.
 *
 * FREQ: per 2 days.
 *
 * R: videoDocs * 6 * 24 * 4 + 1
 * D: videoDocs * 6 * 24 * 4
 */
export const exportSpreadSheetBoost = functions
  .region(firestoreRegion)
  .pubsub.schedule("0, 2, 1, *, *")
  .timeZone("Asia/Tokyo")
  .onRun(async () => {
    logger.info("export spread sheet boost batch started.");
    await exportToSpreadSheet();
    logger.info("export spread sheet boost batch finished.");
  });

const exportToSpreadSheet = async (
  fromDaysAgo?: number,
  toDaysAgo?: number,
) => {
  const envVarsName = defineString("ENV_NAME").value();
  const email = defineString("EMAIL").value();
  const env = await SecretManager.setUpAsync(envVarsName);
  const googleSheetApiKeyJson = env.get<json>("GOOGLE_SHEET_API_KEY_JSON");
  const exportSpreadSheetUseCase = new ExportSpreadSheetUseCase(
    googleSheetApiKeyJson,
    email,
  );

  try {
    await exportSpreadSheetUseCase.exportLastMonthViewHistoryDocs(
      fromDaysAgo,
      toDaysAgo,
    );
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
