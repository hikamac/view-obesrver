import {
  CollectionReference,
  Firestore,
  Transaction,
  WriteBatch,
  WriteResult,
} from "firebase-admin/firestore";
import {FirestoreRepository} from "./firestore-repository";
import {
  NewsCategory,
  NewsDocument,
} from "../../../model/firestore/news-document";

const COLLECTION_NAME = "news";

export class NewsRepository extends FirestoreRepository<NewsDocument> {
  constructor(firestore: Firestore) {
    super(firestore, COLLECTION_NAME);
  }

  public async getNewsWithCursor(
    limit: number,
    startAfterId?: string,
    category?: NewsCategory,
  ): Promise<NewsDocument[]> {
    let query = this.newsRef().orderBy("updated", "desc").limit(limit);
    if (startAfterId) {
      const lastVisibleQuery = this.newsRef().doc(startAfterId);
      const startAfterSnapshot = await lastVisibleQuery.get();
      query = query.startAfter(startAfterSnapshot);
    }
    if (category) {
      query = query.where("category", "==", category);
    }
    const snapshot = await query.get();
    if (super.exists(snapshot)) {
      return snapshot.docs.map((doc) => doc.data() as NewsDocument);
    }
    return [];
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
