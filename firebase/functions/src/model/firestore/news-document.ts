import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {DocumentModel} from "./document-model";

export class NewsDocument extends DocumentModel {
  public updated!: Timestamp | FieldValue;
  public created!: Timestamp | FieldValue;
  public category!: NewsCategory;
  public title!: string;
  public body!: string;
  public url?: string;

  constructor(init?: Partial<NewsDocument>) {
    super(init);
  }
}

const NewsCategory = {
  VIEW_COUNT_APPROACH: 0,
  VIEW_COUNT_REACHED: 1,
  ANNIVERSARY: 2,
} as const;
type NewsCategory = (typeof NewsCategory)[keyof typeof NewsCategory];
