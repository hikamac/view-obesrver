import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {DocumentModel} from "./document-model";

export class VideoDocument extends DocumentModel {
  public videoId!: string;
  public title!: string;
  public updated!: Timestamp | FieldValue;
  public channelId!: string;
  public publishedAt!: Timestamp;
  public milestone!: number;

  constructor(init: Partial<VideoDocument>) {
    super(init);
  }
}

// sub doc
export class ViewHistory extends DocumentModel {
  public created!: Timestamp | FieldValue;
  public viewCount!: number;

  constructor(init: Partial<ViewHistory>) {
    super(init);
    if (!("created" in init)) {
      this.created = FieldValue.serverTimestamp();
    }
  }
}

export class VideoDocumentBuilder {
  private _videoId?: string;
  private _title?: string;
  private _updated?: Timestamp | FieldValue;
  private _channelId?: string;
  private _publishedAt?: Timestamp;
  private _milestone?: number;

  public videoId(videoId: string): VideoDocumentBuilder {
    this._videoId = videoId;
    return this;
  }

  public title(title: string): VideoDocumentBuilder {
    this._title = title;
    return this;
  }

  public updated(updated: Timestamp | FieldValue): VideoDocumentBuilder {
    this._updated = updated;
    return this;
  }

  public channelId(channelId: string): VideoDocumentBuilder {
    this._channelId = channelId;
    return this;
  }

  public publishedAt(publishedAt?: Timestamp): VideoDocumentBuilder {
    this._publishedAt = publishedAt;
    return this;
  }

  public milestone(milestone: number): VideoDocumentBuilder {
    this._milestone = milestone;
    return this;
  }

  public build() {
    return new VideoDocument({
      videoId: this._videoId,
      title: this._title,
      updated: this._updated,
      channelId: this._channelId,
      publishedAt: this._publishedAt,
      milestone: this._milestone,
    });
  }
}

/**
 * 指定された視聴回数に基づいて次の目標を計算する。
 *
 * @param {number} viewCount - 現在の視聴回数。
 * @return {number} 次の目標。視聴回数が1000未満の場合は1000、100万以上の場合は100万刻み、
 * それ以外の場合は現在の桁数の次の10倍。
 *
 * @example
 * calcMilestone(500); // returns 1000
 *
 * @example
 * calcMilestone(15000); // returns 20000
 *
 * @example
 * calcMilestone(1500000); // returns 2000000
 */
export const calcMilestone = (viewCount: number): number => {
  // 1000未満は1000固定
  const MIN_THRESHOLD = 1000;
  // 100万以上は100万刻み
  const MAX_THRESHOLD = 10000000;

  if (viewCount < MIN_THRESHOLD) {
    return 1000;
  } else if (viewCount >= MAX_THRESHOLD) {
    return Math.ceil(viewCount / MAX_THRESHOLD) * MAX_THRESHOLD;
  }
  const digits = Math.floor(Math.log10(viewCount));
  const milestone = Math.pow(10, digits);
  return viewCount < milestone
    ? milestone
    : Math.ceil(viewCount / milestone) * milestone;
};
