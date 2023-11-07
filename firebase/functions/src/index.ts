/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
// import {Firestore} from "firebase-admin/firestore";
import {YouTubeApiService} from "./youtube";
import {defineString} from "firebase-functions/params";
import * as functions from "firebase-functions";
import axios from "axios";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const options: admin.AppOptions = {};
admin.initializeApp(options);

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// export const addMock = onRequest(async (_, res) => {
//   try {
//     const firestore: Firestore = admin.firestore();
//     const mockDock = {name: "John", calledCount: 0};
//     const result = await firestore.collection("mock").add(mockDock);
//     res
//       .status(200)
//       .setHeader("Content-Type", "application/json")
//       .send(JSON.stringify(result));
//   } catch (err) {
//     res.status(500).setHeader("Content-Type", "text/plain").send(err);
//   }
// });

// export const selectMock = onRequest(async (_, res) => {
//   try {
//     const firestore: Firestore = admin.firestore();
//     const selected = await firestore
//       .collection("mock")
//       .where("name", "==", "John")
//       .get();
//     res
//       .status(200)
//       .setHeader("Content-Type", "application/json")
//       .send(JSON.stringify(selected.docs.map((doc) => doc.data())));
//   } catch (err) {
//     res.status(500).setHeader("Content-Type", "text/plain").send(err);
//   }
// });

export const testYt = functions.pubsub
  .schedule("0,30 * * * *")
  .timeZone("Asia/Tokyo")
  .onRun(async (a) => {
    try {
      const youtubeApiService = new YouTubeApiService();
      const targetVideoId = defineString("TARGET_VIDEO_ID");
      const videoInfo = await youtubeApiService.listVideoInfo(
        targetVideoId.value(),
      );

      const webhook = defineString("DISCORD_WEBHOOK_URL");
      const content: string = createContent(videoInfo);
      await axios.post(webhook.value(), {content: content});
      return null;
    } catch (err) {
      logger.error("error", err);
      return null;
    }
  });

function createContent(videoInfo: any): string {
  const snippet = videoInfo.snippet;
  const statistics = videoInfo.statistics;

  return `${snippet.title}の再生回数が${statistics.viewCount}に到達しました！`;
}
