import {
  DocumentReference,
  FieldValue,
  Firestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Transaction,
  WriteBatch,
} from "firebase-admin/firestore";
import {FirestoreRepository} from "./firestore-repository";
import {
  ViewHistory,
  VideoDocument,
  calcMilestone,
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

  public async updateViewCounts(idAndViewCounts: Record<string, number>) {
    const videoIds = Object.keys(idAndViewCounts);
    this.runTransaction(async (tx: Transaction) => {
      // get video documents
      const where = this.getCollection().where("videoId", "in", videoIds);
      const snapshot = await tx.get(where);
      if (!this.exists(snapshot)) {
        return null;
      }
      const documentIdAndData: Record<string, VideoDocument> =
        snapshot.docs.reduce(
          (acc, doc) => {
            acc[doc.id] = doc.data();
            return acc;
          },
          {} as Record<string, VideoDocument>,
        );

      for (const [id, videoDoc] of Object.entries(documentIdAndData)) {
        // add sub documents under each video document
        const videoDocRef = this.getCollection().doc(id);
        const viewCount = idAndViewCounts[videoDoc.videoId];
        if (viewCount === null || viewCount === undefined) continue;
        const viewHistory = new ViewHistory({viewCount: viewCount});
        this.addViewHistoryTx(tx, videoDocRef, viewHistory);

        // update video document and create news
      }

      const batch = this.startBatch();
      for (const [id, videoDoc] of Object.entries(documentIdAndData)) {
        const videoDocRef = this.getCollection().doc(id);
        const viewCount = idAndViewCounts[videoDoc.videoId];
        if (viewCount === null || viewCount === undefined) continue;
        const viewHistory = new ViewHistory({viewCount: viewCount});
        this.addViewHistory(batch, videoDocRef, viewHistory);
        await this.updateVideoMilestone(
          batch,
          videoDocRef,
          videoDoc,
          viewCount,
        );
      }
      this.commitBatch(batch);
      return null;
    });
  }

  public async getByVideoIdsInTx(
    tx: Transaction,
    videoIds: string[],
  ): Promise<Record<string, VideoDocument>> {
    // TODO:
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

  public async addViewHistoryInTx(
    tx: Transaction,
    docId: string,
    viewHistory: ViewHistory,
  ) {
    const ref = this.getCollection().doc(docId);
    return this.addSubDocInTx(tx, ref, SUB_COLLECTION_NAME, viewHistory);
  }

  public async updateViewCountsTx(
    tx: Transaction,
    idAndViewCounts: Record<string, number>,
  ): Promise<void> {
    const videoIds = Object.keys(idAndViewCounts);
    const where = this.getCollection().where("videoId", "in", videoIds);
    const snapshot = await this.getInTx(tx, where);
    if (!this.exists(snapshot)) {
      return;
    }
    const documentIdAndData: Record<string, VideoDocument> =
      snapshot.docs.reduce(
        (acc, doc) => {
          acc[doc.id] = doc.data();
          return acc;
        },
        {} as Record<string, VideoDocument>,
      );
    const batch = this.startBatch();

    for (const [id, videoDoc] of Object.entries(documentIdAndData)) {
      const videoDocRef = this.getCollection().doc(id);
      const viewCount = idAndViewCounts[videoDoc.videoId];
      if (viewCount === null || viewCount === undefined) continue;
      const viewHistory = new ViewHistory({viewCount: viewCount});
      this.addViewHistory(batch, videoDocRef, viewHistory);
      await this.updateVideoMilestone(batch, videoDocRef, videoDoc, viewCount);
    }
    this.commitBatch(batch);
    return;
  }

  private async updateVideoMilestone(
    batch: WriteBatch,
    ref: DocumentReference<VideoDocument>,
    videoDocument: VideoDocument,
    newViewCount: number,
  ): Promise<void> {
    const currentMilestone = videoDocument.milestone;
    if (newViewCount >= currentMilestone) {
      // TODO1: create news document to celebrate reaching milestone
      // } else if (isClose(newViewCount, currentMilestone)) {
      // TODO2: create isClose function viewCount is about to reach milestone
      // TODO3; create news document to notify begin about to reach milestone
    }
    const newMilestone: number = calcMilestone(newViewCount);
    const newVideoDoc = {
      ...videoDocument,
      milestone: newMilestone,
      updated: FieldValue.serverTimestamp(),
    };
    batch.update(ref, newVideoDoc);
  }

  private addViewHistoryTx(
    tx: Transaction,
    ref: DocumentReference<VideoDocument>,
    viewHistory: ViewHistory,
  ) {
    return this.addSubDocInTx(tx, ref, SUB_COLLECTION_NAME, viewHistory);
  }

  private addViewHistory(
    batch: WriteBatch,
    ref: DocumentReference<VideoDocument>,
    viewHistory: ViewHistory,
  ) {
    this.addSubDocumentWithBatch(batch, ref, SUB_COLLECTION_NAME, viewHistory);
  }
}

export class Dto {
  videoId: string;
  oldMilestone: number;
  newMilestone: number;
  viewCount: number;

  constructor(
    videoId: string,
    oldMilestone: number,
    newMilestone: number,
    viewCount: number,
  ) {
    this.videoId = videoId;
    this.oldMilestone = oldMilestone;
    this.newMilestone = newMilestone;
    this.viewCount = viewCount;
  }
}
