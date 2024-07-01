import * as logger from "firebase-functions/logger";

import {onRequest} from "firebase-functions/v2/https";
import {firestoreRegion} from "../../constant/setting-value";
import {OkResponse} from "../../model/ok-response";
import {ViewHistoryUseCase} from "../../service/usecases/view-history-usecase";
import {DebugUtils} from "../debug/debug-utils";

export const fixViewHistoryCreated = onRequest(
  {region: firestoreRegion},
  async (_, res) => {
    // logger setup
    const dutil = new DebugUtils();
    dutil.setupLogFileGenerator();
    try {
      const viewHistoryUseCase = new ViewHistoryUseCase();
      const result = await viewHistoryUseCase.fixViewHistoryCreated();
      console.log("controller");
      res.status(200).send(result);
    } catch (err) {
      logger.error(err);
      console.error(err);
      res.status(500).send(OkResponse.NG);
    } finally {
      dutil.logFileEnd();
    }
  },
);
