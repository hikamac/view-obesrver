import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  QuerySnapshot,
  Transaction,
  UpdateData,
  WriteBatch,
} from "firebase-admin/firestore";
import {DocumentModel} from "../../../model/firestore/document-model";

export abstract class FirestoreRepository<T extends DocumentModel> {
  protected firestore: Firestore;
  protected collectionPath: string;

  constructor(firestore: Firestore, collectionPath: string) {
    this.firestore = firestore;
    this.collectionPath = collectionPath;
  }

  protected getCollection(): CollectionReference<T> {
    return this.firestore
      .collection(this.collectionPath)
      .withConverter(this.converter());
  }

  protected async runTransaction<R>(
    operation: (tx: Transaction) => Promise<R>,
  ): Promise<R> {
    return this.firestore.runTransaction(operation);
  }

  /* Batch */

  public startBatch(): WriteBatch {
    return this.firestore.batch();
  }

  public addWithBatch(
    batch: WriteBatch,
    docRef: DocumentReference<T>,
    data: T,
  ) {
    batch.set(docRef, data);
  }

  public addSubDocumentWithBatch<S extends DocumentModel>(
    batch: WriteBatch,
    docRef: DocumentReference<T>,
    subCollectionName: string,
    data: S,
  ) {
    const subDocRef = docRef.collection(subCollectionName).doc();
    batch.set(subDocRef, data);
  }

  public updateInBatch(
    batch: WriteBatch,
    docRef: DocumentReference<T>,
    data: Partial<T>,
  ) {
    batch.update(docRef, data as UpdateData<T>);
  }

  public deleteInBatch(batch: WriteBatch, docRef: DocumentReference<T>) {
    batch.delete(docRef);
  }

  public commitBatch(batch: WriteBatch) {
    return batch.commit();
  }

  protected abstract converter(): FirestoreDataConverter<T>;

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
