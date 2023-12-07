import {
  DocumentData,
  DocumentSnapshot,
  Firestore,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "firebase-admin/firestore";

export class FirestoreService {
  firestore: Firestore;

  constructor(firestore: Firestore) {
    this.firestore = firestore;
  }

  protected exists(ss: QuerySnapshot<DocumentData>): boolean;
  protected exists(ss: QueryDocumentSnapshot<DocumentData>): boolean;
  protected exists(ss: DocumentSnapshot<DocumentData>): boolean;
  protected exists(ss: unknown): boolean {
    if (ss instanceof QuerySnapshot) {
      let exist = false;
      ss.forEach((d) => {
        if (d.exists) exist = true;
      });
      return exist;
    } else if (ss instanceof QueryDocumentSnapshot) {
      return ss.exists;
    } else if (ss instanceof DocumentSnapshot) {
      return ss.exists;
    } else {
      throw new Error("unexpected type");
    }
  }
}
