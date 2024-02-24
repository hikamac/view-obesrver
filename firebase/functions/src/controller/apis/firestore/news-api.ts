import * as logger from "firebase-functions/logger";
import {HttpsError, onCall} from "firebase-functions/v2/https";
import {NewsQueryUseCase} from "../../../service/usecases/news-query-usecase";
import {atLeast, atMost} from "../../../utils/validation-tool";
import {firestoreRegion} from "../../../constant/setting-value";

/**
 * add video documents in "video" collection if absent
 *
 * R: limit + 0~1
 * W: 0
 *
 * @param {number} limit - max news count.
 * @param {string} lastViewedId - the last document Id in the previous res.
 * @param {string} category - news category filter.
 *
 */
export const news = onCall({region: firestoreRegion}, async (req) => {
  const param = req.data as NewsQueryRequest;
  try {
    atLeast(param.limit, 1);
    atMost(param.limit, 20);
  } catch (e) {
    if (e instanceof RangeError) {
      throw new HttpsError("out-of-range", e.message);
    }
  }

  try {
    const newsQuery = new NewsQueryUseCase();
    const news = await newsQuery.query(
      param.limit,
      param.lastViewedId,
      param.category,
    );
    const lastNews = news[news.length - 1];
    const lastViewedId =
      lastNews != null ? lastNews.generateNewsDocumentId() : null;
    return {
      news: news,
      lastViewedId: lastViewedId,
    };
  } catch (err) {
    logger.error("news: ", err);
    throw new HttpsError("internal", "", `${err}`);
  }
});

interface NewsQueryRequest {
  // MIN(1), MAX(20)
  limit: number;
  lastViewedId?: string;
  category?: string;
}
