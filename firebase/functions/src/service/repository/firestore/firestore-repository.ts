import {
  CollectionReference,
  Firestore,
  FirestoreDataConverter,
  Transaction,
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

  public addInBatch(batch: WriteBatch, data: T) {
    const docRef = this.getCollection().doc();
    batch.set(docRef, data);
  }

  public updateInBatch(
    batch: WriteBatch,
    docRef: FirebaseFirestore.DocumentReference<T>,
    data: Partial<T>,
  ) {
    batch.update(docRef, data as FirebaseFirestore.UpdateData<T>);
  }

  public deleteInBatch(
    batch: FirebaseFirestore.WriteBatch,
    docRef: FirebaseFirestore.DocumentReference<T>,
  ) {
    batch.delete(docRef);
  }

  public commitBatch(batch: FirebaseFirestore.WriteBatch) {
    return batch.commit();
  }

  protected abstract converter(): FirestoreDataConverter<T>;
}
