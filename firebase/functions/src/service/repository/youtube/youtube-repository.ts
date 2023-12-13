import {google} from "googleapis";
import {VideoInfoItem} from "../../../model/youtube/video-info-item";

export class YouTubeDataApiRepository {
  protected youtube;

  constructor(apiKey: string) {
    this.youtube = google.youtube({version: "v3", auth: apiKey});
  }

  public async listVideoInfo(
    videoIds: string[],
    part: Part[],
  ): Promise<Array<VideoInfoItem>> {
    const params = {part: part, id: videoIds};
    const list = await this.youtube.videos.list(params);
    const items = list.data.items != null ? list.data.items : null;
    if (!items) {
      return [];
    }
    return items as Array<VideoInfoItem>;
  }
}

export type Part =
  | "snippet"
  | "contentDetails"
  | "fileDetails"
  | "player"
  | "processingDetails"
  | "recordingDetails"
  | "statistics"
  | "status"
  | "suggestions"
  | "topicDetails";
