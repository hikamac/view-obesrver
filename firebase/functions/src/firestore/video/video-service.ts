import {VideoDocument} from "../../model/firestore/video-document";
import {FirestoreService} from "../firestore-service";
import {
  DocumentData,
  DocumentReference,
  Firestore,
  WriteResult,
} from "firebase-admin/firestore";

export class VideoService extends FirestoreService {
  ref = this.firestore.collection("video");

  constructor(firestore: Firestore) {
    super(firestore);
  }

  async selectByVideoId(videoId: string): Promise<VideoDocument | null> {
    const docArray: VideoDocument[] = [];

    const snapshot = await this.ref.where("videoId", "==", videoId).get();
    if (snapshot.empty) {
      return null;
    }
    snapshot.forEach((doc) => {
      docArray.push(doc.data() as VideoDocument);
    });
    return docArray[0];
  }

  async insert(doc: VideoDocument): Promise<DocumentReference<DocumentData>> {
    return await this.ref.add(doc);
  }

  async insertWithKey(key: string, doc: VideoDocument): Promise<WriteResult> {
    return await this.ref.doc(key).set(doc);
  }

  async updateViewCount(videoId: string, viewCount: number) {
    this.firestore.runTransaction(async (tx) => {
      const videoDoc = await this.selectByVideoId(videoId);
      videoDoc;
    });
  }
}
