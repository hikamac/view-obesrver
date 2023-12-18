import * as logger from "firebase-functions/logger";
import {HttpsError, onCall} from "firebase-functions/v2/https";
import {NewsQueryUseCase} from "../../../service/usecases/news-query-usecase";
import {atLeast, atMost} from "../../../utils/validation-tool";

export const news = onCall(async (req) => {
  try {
    const param = req.data as NewsQueryRequest;
    atLeast(param.limit, 0);
    atMost(param.limit, 20);
    const newsQuery = new NewsQueryUseCase();
    const news = await newsQuery.query(
      param.limit,
      param.lastNewsId,
      param.category,
    );
    const lastNewsId = news[news.length - 1].generateNewsDocumentId();
    return {
      news: news,
      lastNewsId: lastNewsId,
    };
  } catch (err) {
    logger.error(err);
    throw new HttpsError("internal", "", "");
  }
});

interface NewsQueryRequest {
  // MIN(1), MAX(20)
  limit: number;
  lastNewsId?: string;
  category?: string;
}
