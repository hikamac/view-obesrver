export class OkResponse {
  r: Result;

  constructor(r: Result) {
    this.r = r;
  }

  public static get OK() {
    return new OkResponse(Result.OK);
  }

  public static get NG() {
    return new OkResponse(Result.NG);
  }
}

enum Result {
  OK = "OK",
  NG = "NG",
}
