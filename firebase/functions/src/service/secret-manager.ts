import {SecretManagerServiceClient} from "@google-cloud/secret-manager";
import {defineString} from "firebase-functions/params";

export class SecretManager {
  private client: SecretManagerServiceClient;
  private name: string;
  private json: {[key: string]: string | string[]} = {};
  constructor() {
    this.client = new SecretManagerServiceClient();
    this.name = this.client.secretVersionPath(
      "observe-notify",
      defineString("SECRET_NAME").value(),
      defineString("SECRET_VERSION").value(),
    );
  }

  public async setUpAsync(): Promise<void> {
    const [version] = await this.client.accessSecretVersion({name: this.name});
    const payload = version.payload?.data?.toString();
    if (payload === undefined) {
      throw new Error("cannot set up secret manager");
    }
    this.json = JSON.parse(payload) as {[key: string]: string | string[]};
  }

  public get(name: string): string | string[] {
    const value: string | string[] = this.json[name];
    if (value === undefined) {
      throw new Error(`${name} not found`);
    }
    return value;
  }
}
