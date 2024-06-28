import * as logger from "firebase-functions/logger";
import {onRequest} from "firebase-functions/v2/https";
import {firestoreRegion} from "../../constant/setting-value";
import {OkResponse} from "../../model/ok-response";
import {ViewHistoryUseCase} from "../../service/usecases/view-history-usecase";

export const fixViewHistoryCreated = onRequest(
  {region: firestoreRegion},
  async (_, res) => {
    try {
      const viewHistoryUseCase = new ViewHistoryUseCase();
      const result = viewHistoryUseCase.fixViewHistoryCreated();
      res.status(200).send(result);
    } catch (err) {
      logger.error(err);
      res.status(500).send(OkResponse.NG);
    }
  },
);
