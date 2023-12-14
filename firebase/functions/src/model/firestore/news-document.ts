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

  public getCategory() {
    return this.newsCategoryNames[this.category.toString()];
  }

  private readonly newsCategoryNames: {[key: string]: string} = Object.entries(
    NewsCategory,
  ).reduce(
    (pre, [key, value]) => {
      pre[value.toString()] = key;
      return pre;
    },
    {} as {[key: string]: string},
  );

  public static mergeFields = ["updated", "properties"];
}

export const NewsCategory = {
  VIEW_COUNT_APPROACH: 0,
  VIEW_COUNT_REACHED: 1,
  ANNIVERSARY: 2,
} as const;
export type NewsCategory = (typeof NewsCategory)[keyof typeof NewsCategory];
