import {FieldValue, Timestamp} from "firebase-admin/firestore";

export class VideoDocument {
  public videoId!: string;
  public title!: string;
  public updated!: Timestamp | FieldValue;
  public channelId!: string;
  public publishedAt!: Timestamp;
  public milestone!: number;
  public viewHistories: ViewHistory[] = [] as ViewHistory[];

  constructor(init: Partial<VideoDocument>) {
    Object.assign(this, init);
  }
}

export class ViewHistory {
  public created!: Timestamp | FieldValue;
  public viewCount!: number;

  constructor(init: Partial<ViewHistory>) {
    if (!("created" in init)) {
      this.created = FieldValue.serverTimestamp();
    }
    Object.assign(this, init);
  }
}
