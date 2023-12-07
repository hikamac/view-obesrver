import {VideoDocument, ViewHistory}
  from "../../../model/firestore/video-document";
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

  /**
   *
   * @return {Promise<Array<VideoDocument>>} only surface documents
   */
  async select(): Promise<Array<VideoDocument>> {
    const docArray: VideoDocument[] = [];
    const snapshot = await this.ref.get();
    snapshot.forEach((doc) => {
      docArray.push(doc.data() as VideoDocument);
    });
    return docArray;
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

  async insert(
    doc: VideoDocument,
    history: ViewHistory,
  ): Promise<WriteResult[]> {
    const batch = this.firestore.batch();

    const docRef = this.ref.doc();
    batch.set(docRef, doc.parseObj());

    const subDocRef = docRef.collection(this.SUB_COLLECTION_NAME).doc();
    batch.set(subDocRef, history.parseObj());
    return await batch.commit();
  }

  async update(
    doc: VideoDocument,
    history: ViewHistory,
  ): Promise<WriteResult[]> {
    return await this.firestore.runTransaction(async (tx) => {
      const now = FieldValue.serverTimestamp();

      const videoDocs = await tx.get(this.buildQueryRef(doc.videoId));
      if (!this.exists(videoDocs)) {
        throw new Error("video document doesn't exist: " + doc.videoId);
      }

      const videoDoc = videoDocs.docs[0];
      const videoDocData = videoDoc.data() as VideoDocument;
      const newData = {
        ...videoDocData,
        updated: now,
      };

      const batch = this.firestore.batch();
      const docRef = videoDoc.ref;
      batch.update(docRef, newData);
      const subDocRef = docRef.collection(this.SUB_COLLECTION_NAME).doc();
      batch.set(subDocRef, history.parseObj());
      return await batch.commit();
    });
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
      }

      const videoDoc = videoDocs.docs[0];
      const videoDocData = videoDoc.data() as VideoDocument;
      const newData = {
        ...videoDocData,
        updated: now,
      };

      tx.update(videoDoc.ref, newData);

      const vh: ViewHistory = new ViewHistory({
        created: now,
        viewCount: viewCount,
      });

      tx.create(videoDoc.ref, vh.parseObj());
    });
  }

  async bulkUpdate(videoIdAndViewCounts: Record<string, number>)
    : Promise<void> {
    await this.firestore.runTransaction(async (tx) => {
      const now = FieldValue.serverTimestamp();

      const videos = await tx.get(this.ref);
      if (!this.exists(videos)) {
        throw new Error("video document doesn't exist");
      }

      const videoIdAndDocs: Map<string, DocumentData> =
        new Map(videos.docs.map((vd) => {
          const videoDocument = vd.data() as VideoDocument;
          return [videoDocument.videoId, vd];
        }));

      for (const videoId of Object.keys(videoIdAndViewCounts)) {
        // update "video"
        const documentData = videoIdAndDocs.get(videoId);
        const videoDocument = documentData?.data() as VideoDocument;
        const viewCount = videoIdAndViewCounts[videoId];
        const newData = {
          ...videoDocument,
          updated: now,
        };
        tx.update(documentData?.ref, newData);

        // insert "viewHistory" into "video"
        const vh: ViewHistory = new ViewHistory({
          created: now,
          viewCount: viewCount,
        });
        tx.create(documentData?.ref, vh.parseObj());
      }
    });
  }

  private buildQueryRef(videoId: string): Query<DocumentData> {
    return this.ref.where("videoId", "==", videoId);
  }
}
