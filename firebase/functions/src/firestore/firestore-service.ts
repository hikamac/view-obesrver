import {Firestore} from "firebase-admin/firestore";

export class FirestoreService {
  firestore: Firestore;

  constructor(firestore: Firestore) {
    this.firestore = firestore;
  }
}
