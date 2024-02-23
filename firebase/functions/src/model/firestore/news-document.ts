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

  public static reconstruct(
    updated: Timestamp | FieldValue,
    videoId: string,
    videoTitle: string,
    category: NewsCategory,
    properties: {[key: string]: Any},
    url?: string,
  ): NewsDocument {
    return new NewsDocument({
      updated: updated,
      videoId: videoId,
      videoTitle: videoTitle,
      category: category,
      properties: properties,
      url: url,
    });
  }

  public generateNewsDocumentId(): string {
    return `${this.category}-${this.videoId}`;
  }

  public static extractCategory(documentId: string): NewsCategory {
    return documentId.substring(0, documentId.indexOf("-")) as NewsCategory;
  }

  public static extractVideoId(documentId: string): string {
    return documentId.substring(documentId.indexOf("-") + 1);
  }
}

export type NewsCategory =
  | "VIEW_COUNT_APPROACH"
  | "VIEW_COUNT_REACHED"
  | "ANNIVERSARY";
