const { StatusCodes } = require("http-status-codes");

class ForbiddenException extends Error {
  constructor(message = "Forbidden Action", status = StatusCodes.FORBIDDEN) {
    super(message);
    this.status = status;
    this.errorType = "ForbiddenException";
  }
}

module.exports = ForbiddenException;
