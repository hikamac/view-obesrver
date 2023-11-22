import {VideoDocument, ViewHistory} from "../../model/firestore/video-document";
import {FirestoreService} from "../firestore-service";
import {
  DocumentData,
  DocumentReference,
  FieldValue,
  Firestore,
  Query,
  WriteResult,
} from "firebase-admin/firestore";

export class VideoService extends FirestoreService {
  COLLECTION_NAME = "video";
  SUB_COLLECTION_NAME = "view-history";
  ref = this.firestore.collection("video");

  constructor(firestore: Firestore) {
    super(firestore);
  }

  async selectByVideoId(videoId: string): Promise<VideoDocument | null> {
    const docArray: VideoDocument[] = [];

    const snapshot = await this.buildQueryRef(videoId).get();
    if (snapshot.empty) {
      return null;
    }
    snapshot.forEach((doc) => {
      docArray.push(doc.data() as VideoDocument);
    });
    return docArray[0];
  }

  async insert(doc: VideoDocument): Promise<DocumentReference<DocumentData>> {
    return await this.ref.add(doc.parseObj());
  }

  async insertWithKey(key: string, doc: VideoDocument): Promise<WriteResult> {
    return await this.ref.doc(key).set(doc.parseObj());
  }

  async insertHistory(
    doc: DocumentReference,
    history: ViewHistory,
  ): Promise<DocumentReference<DocumentData>> {
    return await doc
      .collection(this.SUB_COLLECTION_NAME)
      .add(history.parseObj());
  }

  async insertHistoryWithKey(
    doc: DocumentReference,
    key: string,
    history: ViewHistory,
  ) {
    return await doc
      .collection(this.SUB_COLLECTION_NAME)
      .doc(key)
      .set(history.parseObj());
  }

  /**
   * @param {string} videoId YouTube video id
   * @param {number} viewCount video's view count
   */
  async updateViewCount(videoId: string, viewCount: number): Promise<void> {
    await this.firestore.runTransaction(async (tx) => {
      const now = FieldValue.serverTimestamp();

      const videoDocs = await tx.get(this.buildQueryRef(videoId));
      if (!this.exists(videoDocs)) {
        throw new Error("video document doesn't exist: " + videoId);
      } else {
        const videoDoc = videoDocs.docs[0];
        const videoDocData = videoDoc.data() as VideoDocument;
        const vh: ViewHistory = new ViewHistory({
          created: now,
          viewCount: viewCount,
        });
        const newData = {
          ...videoDocData,
          updated: now,
          viewHistory: FieldValue.arrayUnion(vh),
        };

        tx.update(videoDoc.ref, newData);
      }
    });
  }

  private buildQueryRef(videoId: string): Query<DocumentData> {
    return this.ref.where("videoId", "==", videoId);
  }
}
