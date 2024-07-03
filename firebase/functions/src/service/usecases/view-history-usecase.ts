import * as admin from "firebase-admin";

import {VideoRepository} from "../repository/firestore/video-repository";
import {
  DebugDocument,
  DebugRepository,
} from "../repository/firestore/debug-repository";

export class ViewHistoryUseCase {
  private videoRepo: VideoRepository;
  private debugRepo: DebugRepository;

  constructor() {
    const firestore = admin.firestore();
    this.videoRepo = new VideoRepository(firestore);
    this.debugRepo = new DebugRepository(firestore);
  }

  public async fixViewHistoryCreated(): Promise<{
    batchCount: number;
    totalFixed: number;
  }> {
    const cursor: DebugDocument | null = await this.debugRepo.getCursor();
    const fixResult = await this.videoRepo.fixViewHistoryCreatedAndUpdated(
      cursor?.viewHistoryDocId,
      cursor?.batchCount ?? 0,
      cursor?.totalFixed ?? 0,
    );

    await this.debugRepo.setCursor(
      new DebugDocument({
        lastDocId: fixResult.lastDocId,
        batchCount: fixResult.batchCount,
        totalFixed: fixResult.totalFixed,
      }),
    );
    return {batchCount: fixResult.batchCount, totalFixed: fixResult.totalFixed};
  }

  // public async getLastMonth(): Promise<Map<VideoDocument, ViewHistory[]>> {
  //   const now = new Date();
  //   const targetYearMonth = new Date(now.getFullYear(), now.getMonth() - 1);

  //   const videoAndViewHistories =
  //     await this.videoRepo.getViewHistories(targetYearMonth);

  //   return videoAndViewHistories;
  // }
}
