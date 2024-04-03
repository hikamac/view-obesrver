import {FieldValue, Timestamp} from "firebase-admin/firestore";

export class DocumentModel {
  [key: string]: unknown;

  constructor(init?: Partial<DocumentModel>) {
    Object.assign(this, init);
  }

  parseObj(): {[key: string]: unknown} {
    const parseValue = (value: unknown): unknown => {
      if (value instanceof Timestamp) {
        return value;
      } else if (value instanceof Date) {
        return Timestamp.fromDate(value);
      } else if (Array.isArray(value)) {
        return value.map(parseValue);
      } else if (value instanceof Object) {
        const obj: {[key: string]: unknown} = {};
        for (const [k, v] of Object.entries(value)) {
          obj[k] = parseValue(v);
        }
        return obj;
      } else {
        return value;
      }
    };

    const obj: {[key: string]: unknown} = {};
    for (const key of Object.getOwnPropertyNames(this)) {
      if (this.hasOwnProperty.call(this, key)) {
        const value = this[key];
        obj[key] = parseValue(value);
      }
    }
    obj.updated = FieldValue.serverTimestamp();
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
