import {defineString} from "firebase-functions/params";
import {google} from "googleapis";
import {VideoInfoItem} from "./model/video-info-item";

export class YouTubeApiService {
  public youtube;

  constructor() {
    const apiKey = defineString("YOUTUBE_DATA_API_KEY");
    this.youtube = google.youtube({version: "v3", auth: apiKey.value()});
  }

  public async listVideoInfo(videoId: string): Promise<VideoInfoItem | null> {
    const params = {part: ["snippet", "statistics"], id: [videoId]};
    const list = await this.youtube.videos.list(params);
    const info = list.data.items != null ? list.data.items[0] : null;
    if (info) {
      return info as VideoInfoItem;
    }
    return null;
  }

  public async listVideoInfo2(videoId: string): Promise<Array<VideoInfoItem>> {
    const params = {part: ["snippet", "statistics"], id: [videoId]};
    const list = await this.youtube.videos.list(params);
    if (list.data.items != null) {
      return list.data as Array<VideoInfoItem>;
    }
    return [];
  }
}
