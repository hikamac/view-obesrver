import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import {VideoRepository} from "../repository/firestore/video-repository";
import {VideoDocument, ViewHistory} from "../../model/firestore/video-document";
import {
  formatDateIntoHMSWithColon,
  formatDateIntoYMDWithSlash,
  getDateNDaysAgo,
} from "../../utils/date-tool";
import {DocumentReference, Timestamp} from "firebase-admin/firestore";
import {json} from "../../type/types";
import {SheetInfo, SpreadSheetService} from "../service/spread-sheet-service";

export class ExportSpreadSheetUseCase {
  private videoRepo: VideoRepository;
  private spreadSheetService: SpreadSheetService;
  private email: string;

  constructor(apiKeyJson: json, email: string) {
    const firestore = admin.firestore();
    this.videoRepo = new VideoRepository(firestore);
    this.spreadSheetService = new SpreadSheetService(
      apiKeyJson.client_email as string,
      apiKeyJson.private_key as string,
    );
    this.email = email;
  }

  public async exportLastMonthViewHistoryDocs(
    searchFromDaysAgo?: number,
    searchToDaysAgo?: number,
  ): Promise<void> {
    const searchSince: Date = getDateNDaysAgo(searchFromDaysAgo ?? 35);
    const searchUntil: Date = getDateNDaysAgo(searchToDaysAgo ?? 30);
    searchUntil.setTime(searchUntil.getTime() - 1);
    const target = await this.findViewHistoriesBetween(
      searchSince,
      searchUntil,
    );

    try {
      const list = await this.spreadSheetService.list();
      let spreadSheetId = "";
      if (list.length > 0) {
        spreadSheetId = list[0].id;
      } else {
        spreadSheetId = await this.spreadSheetService.init();
        await this.spreadSheetService.shareSpreadSheet(
          spreadSheetId,
          this.email,
        );
      }

      await this.appendData(spreadSheetId, target.aggregatedInfo);

      logger.info(`[${searchSince}] - [${searchUntil}] data were exported.`);
      await this.videoRepo.deleteViewHistriesWithRefs(target.refs);
    } catch (err) {
      logger.error(err);
    }
  }

  public async deleteAllSpreadSheetD(): Promise<void> {
    const list = await this.spreadSheetService.list();
    for (const e of list) {
      await this.spreadSheetService.deleteSpreadSheet(e.id);
    }
  }

  private async findViewHistoriesBetween(
    searchSince: Date,
    searchUntil: Date,
  ): Promise<{aggregatedInfo: AggregatedInfo[]; refs: DocumentReference[]}> {
    const docIdAndVideo: Record<string, VideoDocument> =
      await this.videoRepo.getVideos();
    const videoDocIds: string[] = Object.keys(docIdAndVideo);
    const aggregatedInfo: AggregatedInfo[] = [];
    let vhDocIds: string[] = [];
    const refs: DocumentReference[] = [];
    for (const videoDocId of videoDocIds) {
      const target = await this.videoRepo.getViewHistoriesBetween(
        videoDocId,
        searchSince,
        searchUntil,
      );
      const docIdAndViewHistory: Record<string, ViewHistory> =
        target.docIdAndData;

      const video = docIdAndVideo[videoDocId];
      aggregatedInfo.push({
        videoId: video.videoId,
        videoTitle: video.title,
        viewHistories: Object.values(docIdAndViewHistory),
      });
      vhDocIds = vhDocIds.concat(Object.keys(docIdAndViewHistory));
      refs.concat(target.docRefs);
    }
    return {aggregatedInfo: aggregatedInfo, refs: refs};
  }

  private async appendData(
    spreadSheetId: string,
    aggregatedInfos: AggregatedInfo[],
  ): Promise<void> {
    logger.info(`https://docs.google.com/spreadsheets/d/${spreadSheetId}`);

    for (const ai of aggregatedInfos) {
      const createdList: string[] = ai.viewHistories.map((vh) => {
        const createdDate = (vh.created as Timestamp).toDate();
        const createdYMD = formatDateIntoYMDWithSlash(createdDate);
        const createdHM = formatDateIntoHMSWithColon(createdDate).slice(
          0,
          -":00".length,
        );
        return `${createdYMD} ${createdHM}`;
      });

      const sheetInfo: SheetInfo = {
        spreadSheetId: spreadSheetId,
        sheetTitle: ai.videoId,
        rows: [
          {values: createdList, header: "created"},
          {
            values: ai.viewHistories.map((vh) => vh.viewCount),
            header: "viewCount",
          },
        ],
      };
      await this.spreadSheetService.writeDataToSheet(sheetInfo);
    }
  }
}

interface AggregatedInfo {
  videoId: string;
  videoTitle: string;
  viewHistories: ViewHistory[];
}
