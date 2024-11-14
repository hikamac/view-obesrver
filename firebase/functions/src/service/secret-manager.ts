import {SecretManagerServiceClient} from "@google-cloud/secret-manager";
import {json} from "../type/types";
import * as logger from "firebase-functions/logger";

export class SecretManager {
  private json: json;

  private constructor(json: json) {
    this.json = json;
  }

  public static async setUpAsync(
    secretName: string,
    secretVersion = "latest",
  ): Promise<SecretManager> {
    logger.info("setUpAsync");
    logger.info(`secretName: ${secretName}, secretVer: ${secretVersion}`);
    const client = new SecretManagerServiceClient();
    const name = client.secretVersionPath(
      "observe-notify",
      secretName,
      secretVersion,
    );
    logger.info(`name: ${name}`);
    const [version] = await client.accessSecretVersion({name: name});
    const payload = version.payload?.data?.toString();
    logger.info(`payload: ${payload}`);
    if (payload === undefined) {
      throw new Error("cannot set up secret manager");
    }
    try {
      const json = JSON.parse(payload) as json;
      return new SecretManager(json);
    } catch (e) {
      logger.error(e);
      logger.error(`not json formatted payload: ${payload}`);
      try {
        return new SecretManager(JSON.parse(payload));
      } catch (ex) {
        logger.error(ex);
        logger.error(`not object payload: ${payload}`);
        return new SecretManager(JSON.parse(payload.toString()));
      }
    }
  }

  public get<T>(name: string): T {
    const value = this.json[name];
    if (value === undefined) {
      throw new Error(`${name} not found`);
    }
    return value as T;
  }
}
