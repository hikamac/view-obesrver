import {Firestore, FieldValue, Timestamp} from "firebase-admin/firestore";
import {DocumentModel} from "../../../model/firestore/document-model";
import {FirestoreRepository} from "./firestore-repository";

export class DebugDocument extends DocumentModel {
  public viewHistoryDocId!: string;
  public batchCount!: number;
  public totalFixed!: number;
  public updated!: Timestamp | FieldValue;
}

const COLLECTION_NAME = "debug";

export class DebugRepository extends FirestoreRepository<DebugDocument> {
  constructor(firestore: Firestore) {
    super(firestore, COLLECTION_NAME);
  }

  public async getCursor(): Promise<DebugDocument> {
    
  }
}
