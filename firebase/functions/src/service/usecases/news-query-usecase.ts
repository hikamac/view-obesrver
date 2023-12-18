import * as admin from "firebase-admin";
import {NewsRepository} from "../repository/firestore/news-repository";
import {NewsDocument, NewsCategory} from "../../model/firestore/news-document";

export class NewsQueryUseCase {
  private newsRepo: NewsRepository;

  constructor() {
    const firestore = admin.firestore();
    this.newsRepo = new NewsRepository(firestore);
  }

  public async query(
    limit: number,
    lastNewsId?: string,
    category?: string,
  ): Promise<Array<NewsDocument>> {
    const newsCategory = category as NewsCategory;
    return await this.newsRepo.getNewsWithCursor(
      limit,
      lastNewsId,
      newsCategory,
    );
  }
}
