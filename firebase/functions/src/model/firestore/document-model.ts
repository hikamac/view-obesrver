import {FieldValue, Timestamp} from "firebase-admin/firestore";

export class DocumentModel {
  [key: string]: unknown;

  constructor(init?: Partial<DocumentModel>) {
    Object.assign(this, init);
  }

  parseObj(): {[key: string]: unknown} {
    const obj: {[key: string]: unknown} = {};
    for (const key of Object.keys(this)) {
      obj[key] = this[key];
    }
    return obj;
  }
}

export type Any =
  | string
  | number
  | boolean
  | null
  | unknown
  | object
  | Timestamp
  | FieldValue;
