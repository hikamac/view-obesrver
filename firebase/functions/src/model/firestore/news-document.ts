import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {Any, DocumentModel} from "./document-model";

export class NewsDocument extends DocumentModel {
  public updated!: Timestamp | FieldValue;
  public videoId!: string;
  public videoTitle!: string;
  public category!: NewsCategory;
  public properties?: {[key: string]: Any};
  public url?: string;

  constructor(init: Partial<NewsDocument>) {
    super(init);
    if (!("updated" in init)) {
      this.updated = FieldValue.serverTimestamp();
    }
  }

  public generateNewsDocumentId(): string {
    return `${this.category}-${this.videoId}`;
  }

  public static mergeFields = ["updated", "properties"];
}

export type NewsCategory =
  | "VIEW_COUNT_APPROACH"
  | "VIEW_COUNT_REACHED"
  | "ANNIVERSARY";
