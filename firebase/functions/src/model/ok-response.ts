export class OkResponse {
  r: OkNg;

  constructor(r: OkNg) {
    this.r = r;
  }

  public static get OK() {
    return new OkResponse("OK");
  }

  public static get NG() {
    return new OkResponse("NG");
  }
}

type OkNg = "OK" | "NG";
