import * as fs from "fs";
import * as path from "path";

export class DebugUtils {
  logStream: fs.WriteStream | undefined;

  public setupLogFileGenerator = (): void => {
    if (this.logStream !== undefined) {
      return;
    }
    const logFile = path.join(`${process.cwd()}/log`, `logs_${Date.now()}.log`);
    this.logStream = fs.createWriteStream(logFile, {flags: "a"});
    const originalConsoleLog = console.log;
    console.log = (message, ...optionalParams) => {
      originalConsoleLog(message, ...optionalParams);
      this.logStream?.write(`LOG: ${message} ${optionalParams.join(" ")}\n`);
    };
    const originalConsoleError = console.error;
    console.error = (message, ...optionalParams) => {
      originalConsoleError(message, ...optionalParams);
      this.logStream?.write(`ERROR: ${message} ${optionalParams.join(" ")}\n`);
    };
  };

  logFileEnd = (): void => {
    if (this.logStream === undefined) {
      return;
    }
    this.logStream?.end();
  };
}
