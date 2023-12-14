import {
  CollectionReference,
  Firestore,
  Transaction,
  WriteBatch,
  WriteResult,
} from "firebase-admin/firestore";
import {FirestoreRepository} from "./firestore-repository";
import {NewsDocument} from "../../../model/firestore/news-document";

const COLLECTION_NAME = "news";

export class NewsRepository extends FirestoreRepository<NewsDocument> {
  constructor(firestore: Firestore) {
    super(firestore, COLLECTION_NAME);
  }

  public async setNewsInTx(tx: Transaction, newsDoc: NewsDocument) {
    const ref = this.newsRef().doc(newsDoc.generateNewsDocumentId());
    await super.addInTx<NewsDocument>(tx, ref, newsDoc, {
      mergeFields: NewsDocument.mergeFields,
    });
  }

  public startBatch(): WriteBatch {
    return super.startBatch();
  }

  public async addNewsWithBatch(batch: WriteBatch, newsDoc: NewsDocument) {
    const ref = this.newsRef().doc(newsDoc.generateNewsDocumentId());
    super.setWithBatch(batch, ref, newsDoc, {
      mergeFields: NewsDocument.mergeFields,
    });
  }

  public async commitBatch(batch: WriteBatch): Promise<WriteResult[]> {
    return await super.commitBatch(batch);
  }

  /* */

  private newsRef(): CollectionReference<NewsDocument> {
    return super.getCollection<NewsDocument>();
  }
}
