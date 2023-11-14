import {VideoDocument} from "../../model/firestore/video-document";
import {FirestoreService} from "../firestore-service";
import {Firestore} from "firebase-admin/firestore";

export class VideoService extends FirestoreService {
  ref = this.firestore.collection("video");

  constructor(firestore: Firestore) {
    super(firestore);
  }

  async insert(doc: VideoDocument): Promise<void> {}
}
