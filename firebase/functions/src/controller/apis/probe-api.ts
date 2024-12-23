import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import {onRequest} from "firebase-functions/v2/https";
import {firestoreRegion} from "../../constant/setting-value";
import {OkResponse} from "../../model/ok-response";

/**
 * @GET
 * check which project is referenced now.
 *
 */
export const probe = onRequest({region: firestoreRegion}, async (_, res) => {
  try {
    const project = admin.app().options.projectId;
    const message = `projectId: ${project}`;
    logger.info(message);
    res.status(200).send(message);
  } catch (e) {
    logger.error(e);
    res.status(500).send(OkResponse.NG);
  }
});
