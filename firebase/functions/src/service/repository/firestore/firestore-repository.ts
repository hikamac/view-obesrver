import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  FirestoreDataConverter,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  Transaction,
  UpdateData,
  WriteBatch,
  WriteResult,
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

  protected async add(data: T) {
    return this.getCollection().add(data);
  }

  /* Transaction */

  protected async runTransaction<R>(
    operation: (tx: Transaction) => Promise<R>,
  ): Promise<R> {
    return this.firestore.runTransaction(operation);
  }

  protected async getInTx(
    tx: Transaction,
    docRef: DocumentReference,
  ): Promise<DocumentSnapshot<T>>;
  protected async getInTx(
    tx: Transaction,
    query: Query<T>,
  ): Promise<QuerySnapshot<T>>;
  protected async getInTx(tx: Transaction, arg: DocumentReference | Query<T>) {
    if (arg instanceof DocumentReference) {
      return tx.get(arg);
    } else {
      return tx.get(arg);
    }
  }

  protected async addInTx(
    tx: Transaction,
    docRef: DocumentReference<T>,
    data: T,
  ) {
    return tx.set(docRef, data);
  }

  protected async addSubDocInTx<S extends DocumentModel>(
    tx: Transaction,
    docRef: DocumentReference<T>,
    subCollectionName: string,
    data: S,
  ) {
    const subDocRef = docRef.collection(subCollectionName).doc();
    return tx.set(subDocRef, data);
  }

  protected async updateInTx(
    tx: Transaction,
    docRef: DocumentReference<T>,
    data: T,
  ) {
    tx.update(docRef, data as UpdateData<T>);
  }

  /* Batch */

  protected startBatch(): WriteBatch {
    return this.firestore.batch();
  }

  protected addWithBatch(batch: WriteBatch, data: T) {
    batch.set(this.getCollection().doc(), data);
  }

  protected setWithBatch(
    batch: WriteBatch,
    docRef: DocumentReference<T>,
    data: T,
  ) {
    batch.set(docRef, data);
  }

  protected addSubDocumentWithBatch<S extends DocumentModel>(
    batch: WriteBatch,
    docRef: DocumentReference<T>,
    subCollectionName: string,
    data: S,
  ) {
    const subDocRef = docRef.collection(subCollectionName).doc();
    batch.set(subDocRef, data);
  }

  protected updateWithBatch(
    batch: WriteBatch,
    docRef: DocumentReference<T>,
    data: T,
  ) {
    batch.update(docRef, data as UpdateData<T>);
  }

  protected deleteInBatch(batch: WriteBatch, docRef: DocumentReference<T>) {
    batch.delete(docRef);
  }

  protected commitBatch(batch: WriteBatch): Promise<WriteResult[]> {
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
