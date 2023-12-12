import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {Any, DocumentModel} from "./document-model";

export class NewsDocument extends DocumentModel {
  public updated!: Timestamp | FieldValue;
  public created!: Timestamp | FieldValue;
  public category!: NewsCategory;
  public properties?: {[key: string]: Any};
  public url?: string;

  constructor(init: Partial<NewsDocument>) {
    super(init);
    if (!("updated" in init)) {
      this.updated = FieldValue.serverTimestamp();
    }
    if (!("created" in init)) {
      this.created = FieldValue.serverTimestamp();
    }
  }
}

export const NewsCategory = {
  VIEW_COUNT_APPROACH: 0,
  VIEW_COUNT_REACHED: 1,
  ANNIVERSARY: 2,
} as const;
export type NewsCategory = (typeof NewsCategory)[keyof typeof NewsCategory];
