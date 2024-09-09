import {google} from "googleapis";
import {logger} from "firebase-functions/v1";

export class SpreadSheetService {
  private sheets;
  private drive;

  constructor(email: string, key: string) {
    const authClient = new google.auth.JWT({
      email: email,
      key: key,
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
      ],
    });
    this.sheets = google.sheets({version: "v4", auth: authClient});
    this.drive = google.drive({version: "v3", auth: authClient});
  }

  public async list(): Promise<{id: string}[]> {
    const res = await this.drive.files.list({
      q: "mimeType='application/vnd.google-apps.spreadsheet'",
      fields: "files(id, name)",
    });

    const files = res.data.files;
    if (!files) {
      return [];
    }
    return files?.map((f) => {
      return {id: `${f.id}`};
    });
  }

  public async init(): Promise<string> {
    const spreadSheetName = "video_view_counts";
    const spreadSheetId: string = await this.createSpreadSheet(spreadSheetName);
    return spreadSheetId;
  }

  private async createSpreadSheet(spreadSheetName: string): Promise<string> {
    const resource = {
      requestBody: {
        properties: {
          title: spreadSheetName,
        },
      },
    };
    const spreadsheet = await this.sheets.spreadsheets.create(resource);
    const spreadSheetId = spreadsheet.data.spreadsheetId;
    if (!spreadSheetId) {
      throw Error("sheet creation failed");
    }
    return spreadsheet.data.spreadsheetId as string;
  }

  private async addSheet(sheetInfo: SheetInfo): Promise<void> {
    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetInfo.spreadSheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetInfo.sheetTitle,
              },
            },
          },
        ],
      },
    });

    logger.info(`sheet "${sheetInfo.sheetTitle}" was created.`);

    if (sheetInfo.header !== null) {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: sheetInfo.spreadSheetId,
        range: `${sheetInfo.sheetTitle}!A1`,
        valueInputOption: "RAW",
        requestBody: {
          values: [sheetInfo.header as string[]],
        },
      });
    }
  }

  private async doesSheetExist(
    spreadSheetId: string,
    sheetName: string,
  ): Promise<boolean> {
    const metadata = await this.sheets.spreadsheets.get({
      spreadsheetId: spreadSheetId,
    });
    const sheetExists = metadata.data.sheets?.some(
      (sheet) => sheet.properties?.title === sheetName,
    );
    logger.info(sheetExists);
    return sheetExists !== undefined && sheetExists !== false;
  }

  public async writeDataToSheet(sheetInfo: SheetInfo) {
    const exist = await this.doesSheetExist(
      sheetInfo.spreadSheetId,
      sheetInfo.sheetTitle,
    );
    if (!exist) {
      await this.addSheet(sheetInfo);
    }

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: sheetInfo.spreadSheetId,
      range: `${sheetInfo.sheetTitle}!A1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: sheetInfo.table.map((row) => row.cells),
      },
    });
  }

  public async shareSpreadSheet(spreadsheetId: string, email: string) {
    await this.drive.permissions.create({
      fileId: spreadsheetId,
      requestBody: {role: "writer", type: "user", emailAddress: email},
    });
  }

  public async deleteSpreadSheet(spreadSheetId: string) {
    await this.drive.files.delete({fileId: spreadSheetId});
    logger.info(`Sheet [${spreadSheetId}] was deleted.`);
  }
}

export interface SheetInfo {
  spreadSheetId: string;
  sheetTitle: string;
  header?: string[];
  table: RowInfo[];
}

export interface RowInfo {
  cells: unknown[];
}
