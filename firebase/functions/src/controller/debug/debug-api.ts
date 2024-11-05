import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {defineString} from "firebase-functions/params";
import {onRequest} from "firebase-functions/v2/https";
import {SecretManager} from "../../service/secret-manager";
// prettier-ignore
import {
  AnniversaryUseCase} from "../../service/usecases/anniversary-usecase";
import {OkResponse} from "../../model/ok-response";
import {ViewCountUseCase} from "../../service/usecases/view-count-usecase";
import {firestoreRegion} from "../../constant/setting-value";
import {NewsQueryUseCase} from "../../service/usecases/news-query-usecase";
// prettier-ignore
import {ExportSpreadSheetUseCase}
  from "../../service/usecases/export-spreadsheet-usecase";
import {json} from "../../type/types";

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

export const fetchAndStoreD = onRequest(async (_, res) => {
  const envVarsName = defineString("ENV_NAME").value();
  const secretVarsName = defineString("SECRET_NAME").value();
  try {
    const env = await SecretManager.setUpAsync(envVarsName);
    const youtubeDataApiKey = env.get<string>("YOUTUBE_DATA_API_KEY");
    const viewCountUseCase = new ViewCountUseCase(youtubeDataApiKey);
    const secret = await SecretManager.setUpAsync(secretVarsName);
    const targetVideoIds = secret.get<string[]>("TARGET_VIDEO_IDS");

    await viewCountUseCase.fetchAndStore(targetVideoIds);
    res.status(200).send(OkResponse.OK);
  } catch (error) {
    logger.error(error);
    res.status(500).send(OkResponse.NG);
  }
});

export const newsD = onRequest({region: firestoreRegion}, async (_, res) => {
  try {
    const newsQuery = new NewsQueryUseCase();
    const news = await newsQuery.query(20);
    const lastNews = news[news.length - 1];
    const lastViewedId =
      lastNews != null ? lastNews.generateNewsDocumentId() : null;
    res.status(200).send({
      news: news,
      lastViewedId: lastViewedId,
    });
  } catch (err) {
    logger.error("news: ", err);
    res.status(500).send("internal");
  }
});

export const createExportDataForSpreadSheetDev = functions
  .region(firestoreRegion)
  .runWith({timeoutSeconds: 540})
  .https.onRequest(async (req, res) => {
    const videoDocId = `${req.query.id}`;
    logger.info(`videoDocId is ${videoDocId}`);

    try {
      const firestore = admin.firestore();
      const videoDoc = firestore.collection("video").doc(videoDocId);
      const viewHistoryCollection = videoDoc.collection("view-history");

      const snapshot = await viewHistoryCollection
        .orderBy("updated", "desc")
        .get();

      logger.info(`snapshot size is ${snapshot.size}`);

      const batch = firestore.batch();
      for (const doc of snapshot.docs) {
        const data = doc.data();

        const created =
          data.created && data.created._seconds ? data.created : data.updated;
        let updated = undefined;
        if (data.created && data.created._seconds) {
          updated = data.created;
        } else {
          updated = data.updated;
        }

        batch.set(doc.ref, {created: created, updated: updated}, {merge: true});
      }

      await batch.commit();

      res.status(200).send(`${snapshot.size} docs were fixed.`);
    } catch (err) {
      logger.error(err);
      res.status(500).send();
    }
  });

export const exportSpreadSheetD = functions
  .region(firestoreRegion)
  .runWith({timeoutSeconds: 540})
  .https.onRequest(async (req, res) => {
    const envVarsName = defineString("ENV_NAME").value();
    const email = defineString("EMAIL").value();
    const env = await SecretManager.setUpAsync(envVarsName);
    const googleSheetApiKeyJson = env.get<json>("GOOGLE_SHEET_API_KEY_JSON");
    const exportSpreadSheetUseCase = new ExportSpreadSheetUseCase(
      googleSheetApiKeyJson,
      email,
    );
    let from = Number(req.query.from);
    let to = Number(req.query.to);
    try {
      if (!from || !to) {
        const range = await exportSpreadSheetUseCase.getTargetRange();
        from = range.from;
        to = range.to;
      }
      const url = await exportSpreadSheetUseCase.exportLastMonthViewHistoryDocs(
        from,
        to,
      );
      logger.info(`URL: ${url}`);

      res.status(200).send();
    } catch (err) {
      logger.error(err);
      res.status(500).send();
    }
  });

export const deleteAllSpreadSheets = functions
  .region(firestoreRegion)
  .runWith({timeoutSeconds: 540})
  .https.onRequest(async (req, res) => {
    const envVarsName = defineString("ENV_NAME").value();
    const email = defineString("EMAIL").value();
    const env = await SecretManager.setUpAsync(envVarsName);
    const googleSheetApiKeyJson = env.get<json>("GOOGLE_SHEET_API_KEY_JSON");
    const exportSpreadSheetUseCase = new ExportSpreadSheetUseCase(
      googleSheetApiKeyJson,
      email,
    );
    try {
      await exportSpreadSheetUseCase.deleteAllSpreadSheetD();
      res.status(200).send("all sheets are deleted.");
    } catch (err) {
      logger.error(err);
      res.status(500).send();
    }
  });
