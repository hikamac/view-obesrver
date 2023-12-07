import {
  CollectionReference,
  DocumentData,
  Firestore,
  FirestoreDataConverter,
  Query,
  QueryDocumentSnapshot,
  WriteBatch,
} from "firebase-admin/firestore";
import {FirestoreRepository} from "./firestore-repository";
import {VideoDocument} from "../../../model/firestore/video-document";

const COLLECTION_NAME = "video";

export class VideoRepository extends FirestoreRepository<VideoDocument> {
  constructor(firestore: Firestore) {
    super(firestore, COLLECTION_NAME);
  }

  protected converter(): FirestoreDataConverter<VideoDocument> {
    return {
      toFirestore(model: VideoDocument) {
        return model.parseObj();
      },
      fromFirestore(snapshot: QueryDocumentSnapshot) {
        return snapshot.data() as VideoDocument;
      },
    };
  }

  public async updateViewCount(
    idAndViewCount: Record<string, number>,
    batch: WriteBatch,
  ) {
    for (const [id, viewCount] of Object.entries(idAndViewCount)) {
      // TODO
    }
  }
}
