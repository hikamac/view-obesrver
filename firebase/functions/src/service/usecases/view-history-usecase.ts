import * as admin from "firebase-admin";

import {VideoRepository} from "../repository/firestore/video-repository";

export class ViewHistoryUseCase {
  private videoRepo: VideoRepository;

  constructor() {
    const firestore = admin.firestore();
    this.videoRepo = new VideoRepository(firestore);
  }

  public async fixViewHistoryCreated(): Promise<{
    batchCount: number;
    totalFixed: number;
  }> {
    return await this.videoRepo.fixViewHistoryCreatedAndUpdated();
  }

  // public async getLastMonth(): Promise<Map<VideoDocument, ViewHistory[]>> {
  //   const now = new Date();
  //   const targetYearMonth = new Date(now.getFullYear(), now.getMonth() - 1);

  //   const videoAndViewHistories =
  //     await this.videoRepo.getViewHistories(targetYearMonth);

  //   return videoAndViewHistories;
  // }
}
