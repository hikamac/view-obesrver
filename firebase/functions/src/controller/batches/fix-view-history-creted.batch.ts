import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import {firestoreRegion} from "../../constant/setting-value";
import {ViewHistoryUseCase} from "../../service/usecases/view-history-usecase";

export const fixViewHistoryCreated = functions
  .region(firestoreRegion)
  .pubsub.schedule("every 2 minutes")
  .timeZone("Asia/Tokyo")
  .onRun(async () => {
    try {
      const viewHistoryUseCase = new ViewHistoryUseCase();
      const result = await viewHistoryUseCase.fixViewHistoryCreated();
      logger.info(
        `${result.batchCount}th process finished. ` +
          `The total is now ${result.totalFixed}.`,
      );
    } catch (err) {
      logger.error(err);
    }
  });
