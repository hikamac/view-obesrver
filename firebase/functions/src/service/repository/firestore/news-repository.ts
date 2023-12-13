import {
  Firestore,
  FirestoreDataConverter,
  Transaction,
} from "firebase-admin/firestore";
import {FirestoreRepository} from "./firestore-repository";
import {NewsDocument} from "../../../model/firestore/news-document";
import {QueryDocumentSnapshot} from "firebase-functions/v1/firestore";

const COLLECTION_NAME = "news";

export class NewsRepository extends FirestoreRepository<NewsDocument> {
  constructor(firestore: Firestore) {
    super(firestore, COLLECTION_NAME);
  }

  protected converter(): FirestoreDataConverter<NewsDocument> {
    return {
      toFirestore(model: NewsDocument) {
        return model.parseObj();
      },
      fromFirestore(snapshot: QueryDocumentSnapshot) {
        return snapshot.data() as NewsDocument;
      },
    };
  }

  public async setNewsInTx(
    tx: Transaction,
    docId: string,
    newsDoc: NewsDocument,
  ) {
    const ref = super.getCollection().doc(docId);
    await super.addInTx(tx, ref, newsDoc);
  }
}
