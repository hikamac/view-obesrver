import {
  CollectionReference,
  FieldValue,
  Firestore,
  Transaction,
  WriteBatch,
  WriteResult,
} from "firebase-admin/firestore";
import {FirestoreRepository} from "./firestore-repository";
import {
  ViewHistory,
  VideoDocument,
} from "../../../model/firestore/video-document";
import {logger} from "firebase-functions/v1";

const COLLECTION_NAME = "video";
const SUB_COLLECTION_NAME = "view-history";

export class VideoRepository extends FirestoreRepository<VideoDocument> {
  constructor(firestore: Firestore) {
    super(firestore, COLLECTION_NAME);
  }

  public async getVideos(): Promise<Record<string, VideoDocument>> {
    const snapshot = await super.getCollection<VideoDocument>().get();
    if (!super.exists(snapshot)) {
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

  public async addVideos(videoDocuments: VideoDocument[]) {
    const batch = super.startBatch();
    for (const vd of videoDocuments) {
      super.addWithBatch(batch, vd);
    }
    return await super.commitBatch(batch);
  }

  public async getByVideoIdsInTx(
    tx: Transaction,
    videoIds: string[],
  ): Promise<Record<string, VideoDocument>> {
    const query = this.videoRef().where("videoId", "in", videoIds);
    const snapshot = await super.getInTx(tx, query);
    if (!super.exists(snapshot)) {
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
    const ref = this.videoRef().doc(docId);
    await super.updateInTx(tx, ref, videoDocument);
  }

  public async addViewHistoryInTx(
    tx: Transaction,
    videoDocId: string,
    viewHistory: ViewHistory,
  ) {
    const ref = this.viewHistoryRef(videoDocId).doc();
    return super.addInTx<ViewHistory>(tx, ref, viewHistory);
  }

  /* batch */

  public startBatch(): WriteBatch {
    return super.startBatch();
  }

  public addVideoWithBatch(batch: WriteBatch, videoDoc: VideoDocument): string {
    const ref = this.videoRef().doc();
    super.setWithBatch(batch, ref, videoDoc);
    return ref.id;
  }

  public addViewHistoryWithBatch(
    batch: WriteBatch,
    videoDocId: string,
    viewHistory: ViewHistory,
  ) {
    const ref = this.videoRef();
    super.addSubDocumentWithBatch<ViewHistory>(
      batch,
      ref.doc(videoDocId),
      SUB_COLLECTION_NAME,
      viewHistory,
    );
  }

  public async fixViewHistoryCreatedAndUpdated(): Promise<{
    batchCount: number;
    totalFixed: number;
  }> {
    const viewHistoryCollection =
      this.firestore.collectionGroup(SUB_COLLECTION_NAME);
    const LIMIT = 500;
    let lastDoc = null;
    let batchCount = 0;
    let totalFixed = 0;

    do {
      let query = viewHistoryCollection.orderBy("__name__").limit(LIMIT);
      if (lastDoc) {
        query = query.startAfter(lastDoc);
      }

      const snapshot = await query.get();
      if (super.exists(snapshot)) {
        logger.info("No more documents to process");
      }

      const batch = this.firestore.batch();

      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        const created =
          data.created && data.created._seconds ? data.created : data.updated;
        let updated = undefined;
        if (data.created && data.created._seconds) {
          updated = data.created;
        } else if (data.updated) {
          updated = data.updated;
        } else {
          updated = FieldValue.serverTimestamp();
        }

        batch.update(doc.ref, {created: created, updated: updated});
      });

      await batch.commit();
      lastDoc = snapshot.docs[snapshot.docs.length - 1];
      batchCount += 1;
      totalFixed += snapshot.size;
    } while (lastDoc);

    logger.info("All documents have been updated.");
    logger.info(
      "%d batches proceeded, %d documents are fixed.",
      batchCount,
      totalFixed,
    );
    return {batchCount: batchCount, totalFixed: totalFixed};
  }

  public async commitBatch(batch: WriteBatch): Promise<WriteResult[]> {
    return await super.commitBatch(batch);
  }

  /* */

  private videoRef(): CollectionReference<VideoDocument> {
    return super.getCollection<VideoDocument>();
  }

  private viewHistoryRef(videoDocId: string): CollectionReference<ViewHistory> {
    const vhRef = this.videoRef().doc(videoDocId);
    return super.getSubCollection<ViewHistory>(vhRef, SUB_COLLECTION_NAME);
  }
}
