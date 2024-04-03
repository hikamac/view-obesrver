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
