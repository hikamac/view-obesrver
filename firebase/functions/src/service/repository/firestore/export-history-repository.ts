import {Firestore} from "firebase-admin/firestore";
import {DocumentModel} from "../../../model/firestore/document-model";
import {FirestoreRepository} from "./firestore-repository";
import * as logger from "firebase-functions/logger";

export class ExportHistoryDocument extends DocumentModel {
  public untilXdaysAgo!: number;

  constructor(init: Partial<ExportHistoryDocument>) {
    super(init);
  }
}

const COLLECTION_NAME = "export-history";

export class ExportHistoryRepository extends FirestoreRepository<ExportHistoryDocument> {
  constructor(firestore: Firestore) {
    super(firestore, COLLECTION_NAME);
  }

  public async getExportHistory(): Promise<ExportHistoryDocument | null> {
    const docRef = super
      .getCollection<ExportHistoryDocument>()
      .doc("milestone");
    logger.info(`docRef: ${docRef}`);
    const doc = await docRef.get();
    logger.info(`doc: ${doc}`);
    if (doc.exists) {
      return doc.data() as ExportHistoryDocument;
    } else {
      return null;
    }
  }

  public async setExportHistory(
    document: ExportHistoryDocument,
  ): Promise<void> {
    await super
      .getCollection<ExportHistoryDocument>()
      .doc("milestone")
      .set(document);
  }
}
