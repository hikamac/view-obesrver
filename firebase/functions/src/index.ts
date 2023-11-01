/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import {Firestore} from "firebase-admin/firestore";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const options: admin.AppOptions = {};
admin.initializeApp(options);

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

export const addMock = onRequest(async () => {
  logger.info("Hello logs!", {structuredData: true});
  const firestore: Firestore = admin.firestore();
  const mockDock = {name: "John"};
  const result = await firestore.collection("mock").add(mockDock);
  console.log("result", result);
});
