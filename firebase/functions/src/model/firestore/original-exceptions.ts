export class DocumentNotFoundException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "DocumentNotFoundException";

    // for correct prototype chain
    Object.setPrototypeOf(this, new.target.prototype);

    // for enable instanceof
    Error.captureStackTrace(this, this.constructor);
  }
}
