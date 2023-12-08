import * as admin from "firebase-admin";
import {NewsRepository} from "../repository/firestore/news-repository";
import {VideoRepository} from "../repository/firestore/video-repository";
import {Transaction} from "firebase-admin/firestore";

class ViewCountUseCase {
  private firestore: admin.firestore.Firestore;
  private videoRepo: VideoRepository;
  private newsRepo: NewsRepository;
  constructor() {
    this.firestore = admin.firestore();
    this.videoRepo = new VideoRepository(this.firestore);
    this.newsRepo = new NewsRepository(this.firestore);
  }

  public async updateVideoAndCreateNewsIfNeeded(
    videoIdAndViewCounts: Record<string, number>,
  ): Promise<void> {
    // TODO
    this.firestore.runTransaction(async (tx: Transaction) => {
      await this.videoRepo.updateViewCountsTx(tx, videoIdAndViewCounts);
    });
  }
}
