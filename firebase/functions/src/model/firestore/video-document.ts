import {Timestamp} from "firebase-admin/firestore";
import {VideoInfoItem} from "../video-info-item";

export class VideoDocument {
  videoId!: string;
  title!: string;
  updated!: Timestamp;
  channelId!: string;
  publishedAt!: Timestamp;
  milestone!: number;

  constructor(init: Partial<VideoInfoItem>) {
    Object.assign(this, init);
  }
}

export class ViewHistory {
  created!: Timestamp;
  viewCount!: number;

  constructor(init: Partial<ViewHistory>) {
    Object.assign(this, init);
  }
}
