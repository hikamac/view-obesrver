import {Firestore, FieldValue, Timestamp} from "firebase-admin/firestore";
import {DocumentModel} from "../../../model/firestore/document-model";
import {FirestoreRepository} from "./firestore-repository";

export class DebugDocument extends DocumentModel {
  public viewHistoryDocId!: string | undefined;
  public batchCount!: number;
  public totalFixed!: number;
  public updated!: Timestamp | FieldValue;

  constructor(init: Partial<DebugDocument>) {
    super(init);
  }
}

const COLLECTION_NAME = "debug";

export class DebugRepository extends FirestoreRepository<DebugDocument> {
  constructor(firestore: Firestore) {
    super(firestore, COLLECTION_NAME);
  }

  public async getCursor(): Promise<DebugDocument | null> {
    const cursor = await super
      .getCollection<DebugDocument>()
      .doc("viewHistoryCursor")
      .get();
    if (cursor.exists) {
      return cursor.data() as DebugDocument;
    } else {
      return null;
    }
  }

  public async setCursor(debugDocument: DebugDocument): Promise<void> {
    await super
      .getCollection<DebugDocument>()
      .doc("viewHistoryCursor")
      .set(debugDocument);
  }
}
