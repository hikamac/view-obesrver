import {defineString} from "firebase-functions/params";
import {google} from "googleapis";

export class YouTubeApiService {
  public youtube;

  constructor() {
    const apiKey = defineString("YOUTUBE_DATA_API_KEY");
    this.youtube = google.youtube({version: "v3", auth: apiKey.value()});
  }

  public async listVideoInfo(videoId: string) {
    const params = {part: ["snippet", "statistics"], id: [videoId]};
    const list = await this.youtube.videos.list(params);
    const info = list.data.items != null ? list.data.items[0] : null;
    if (info) {
      return {
        snippet: info.snippet,
        statistics: info.statistics,
      };
    }
    return null;
  }
}
