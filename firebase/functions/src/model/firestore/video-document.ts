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
 * Calculate the next milestone based on the number of views.
 *
 * @param {number} viewCount - current view count
 * @return {number} - Next milestone.
 * If the number of views is less than 1,000, the number is 1,000;
 * if the number is 1,000,000 or more, the number is in increments of 1,000,000,
 * If otherwise, the next 10 times the current digit.
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

/**
 * Determine if it is approaching the next milestone.
 * Cases exceeding milestones are not addressed.
 * @param {number} currentViewCount - current view count
 *
 * @return {boolean}
 */
export const isCloseToNextMilestone = (currentViewCount: number): boolean => {
  const nextMilestone = calcMilestone(currentViewCount);
  const digits = Math.floor(Math.log10(nextMilestone)) - 2;
  const thresholdSubtractor = Math.pow(10, digits) * 5;
  const threshold = nextMilestone - thresholdSubtractor;
  return currentViewCount >= threshold;
};
