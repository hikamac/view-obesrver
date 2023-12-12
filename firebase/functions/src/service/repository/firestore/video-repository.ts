import {
  Firestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Transaction,
} from "firebase-admin/firestore";
import {FirestoreRepository} from "./firestore-repository";
import {
  ViewHistory,
  VideoDocument,
} from "../../../model/firestore/video-document";

const COLLECTION_NAME = "video";
const SUB_COLLECTION_NAME = "view-history";

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

  public async getByVideoIdsInTx(
    tx: Transaction,
    videoIds: string[],
  ): Promise<Record<string, VideoDocument>> {
    const query = this.getCollection().where("videoId", "in", videoIds);
    const snapshot = await this.getInTx(tx, query);
    if (!this.exists(snapshot)) {
      return {};
    }
    const documentIdAndData: Record<string, VideoDocument> =
      snapshot.docs.reduce(
        (acc, doc) => {
          acc[doc.id] = doc.data();
          return acc;
        },
        {} as Record<string, VideoDocument>,
      );
    return documentIdAndData;
  }

  public async updateVideoInTx(
    tx: Transaction,
    docId: string,
    videoDocument: VideoDocument,
  ) {
    const ref = this.getCollection().doc(docId);
    await super.updateInTx(tx, ref, videoDocument);
  }

  public async addViewHistoryInTx(
    tx: Transaction,
    docId: string,
    viewHistory: ViewHistory,
  ) {
    const ref = this.getCollection().doc(docId);
    return this.addSubDocInTx(tx, ref, SUB_COLLECTION_NAME, viewHistory);
  }
}
