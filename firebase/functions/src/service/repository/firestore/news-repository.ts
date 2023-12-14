import {
  CollectionReference,
  Firestore,
  Transaction,
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
    await super.addInTx<NewsDocument>(tx, ref, newsDoc);
  }

  /* */

  private newsRef(): CollectionReference<NewsDocument> {
    return super.getCollection<NewsDocument>();
  }
}
