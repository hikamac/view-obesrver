import {Firestore, FirestoreDataConverter} from "firebase-admin/firestore";
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
}
