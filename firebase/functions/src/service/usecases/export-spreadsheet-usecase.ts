import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import {VideoRepository} from "../repository/firestore/video-repository";
import {VideoDocument, ViewHistory} from "../../model/firestore/video-document";
import {google} from "googleapis";

export class ExportSpreadSheetUseCase {
  private videoRepo: VideoRepository;
  private sheet;

  constructor() {
    const firestore = admin.firestore();
    this.videoRepo = new VideoRepository(firestore);
    this.sheet = google.sheets("v4");
  }

  public async exportLastMonthVideoDocs(): Promise<void> {
    const searchSince: Date = this.getDateNDaysAgo(35);
    const searchUntil: Date = this.getDateNDaysAgo(30);
    searchUntil.setTime(searchUntil.getTime() - 1);

    const searchResult = await this.findViewHistoriesBetween(
      searchSince,
      searchUntil,
    );

    try {
      // await exportToSpreadSheet(searchResult.aggregatedInfos);
      for (const aggregatedInfo of searchResult.aggregatedInfos) {
        logger.info("videoDocId: " + aggregatedInfo.videoId);
        logger.info("vhDocSize: " + aggregatedInfo.viewHistories.length);
        logger.info(this.sheet != null ? "sheet OK" : "NG");
      }
      // await deleteExportedDocuments(searchResult);
    } catch (err) {
      logger.error(err);
    }
  }

  private async findViewHistoriesBetween(
    searchSince: Date,
    searchUntil: Date,
  ): Promise<{
    aggregatedInfos: AggregatedInfo[];
    viewHistoryDocIds: string[];
  }> {
    const docIdAndVideo: Record<string, VideoDocument> =
      await this.videoRepo.getVideos();
    const videoDocIds: string[] = Object.keys(docIdAndVideo);
    const aggregatedInfo: AggregatedInfo[] = [];
    let vhDocIds: string[] = [];
    for (const videoDocId of videoDocIds) {
      const docIdAndViewHistory: Record<string, ViewHistory> =
        await this.videoRepo.getViewHistoriesBetween(
          videoDocId,
          searchSince,
          searchUntil,
        );

      const videoId = docIdAndVideo[videoDocId].videoId;
      aggregatedInfo.push({
        videoId: videoId,
        viewHistories: Object.values(docIdAndViewHistory),
      });
      vhDocIds = vhDocIds.concat(Object.keys(docIdAndViewHistory));
    }
    return {aggregatedInfos: aggregatedInfo, viewHistoryDocIds: vhDocIds};
  }

  // private async exportToSpreadSheet(
  //   aggregatedInfos: AggregatedInfo[],
  // ): Promise<void> {}

  // private async deleteExportedDocuments(
  //   viewHistoryDocIds: string[],
  // ): Promise<void> {}

  /* */

  private getDateNDaysAgo(n: number): Date {
    const today = new Date();
    today.setDate(today.getDate() - n);
    return today;
  }
}

interface AggregatedInfo {
  videoId: string;
  viewHistories: ViewHistory[];
}
