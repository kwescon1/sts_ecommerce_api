const { StatusCodes } = require("http-status-codes");

class ConflictException extends Error {
  constructor(
    message = "Resource Conflict Occured",
    status = StatusCodes.CONFLICT
  ) {
    super(message);
    this.status = status;
    this.errorType = "ConflictException";
  }
}

module.exports = ConflictException;
