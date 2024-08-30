import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import {firestoreRegion} from "../../constant/setting-value";

export const exportSpreadSheet = functions
  .region(firestoreRegion)
  .pubsub.schedule("0, 4, 1, *, *")
  .timeZone("Asia/Tokyo")
  .onRun(async () => {
    logger.info("export spread sheet batch started.");
  });
