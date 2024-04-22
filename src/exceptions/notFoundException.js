import { StatusCodes } from "http-status-codes";

export class NotFoundException extends Error {
  constructor(message = "Resource Not Found", status = StatusCodes.NOT_FOUND) {
    super(message);
    this.status = status;
    this.errorType = "NotFoundException";
  }
}
