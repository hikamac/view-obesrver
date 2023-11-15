import {Timestamp} from "firebase-admin/firestore";

export class VideoDocument {
  public videoId!: string;
  public title!: string;
  public updated!: Timestamp;
  public channelId!: string;
  public publishedAt!: Timestamp;
  public milestone!: number;
  public viewHistories: ViewHistory[] = [];

  constructor(init: Partial<VideoDocument>) {
    Object.assign(this, init);
  }
}

export class ViewHistory {
  public created!: Timestamp;
  public viewCount!: number;

  constructor(init: Partial<ViewHistory>) {
    Object.assign(this, init);
  }
}
