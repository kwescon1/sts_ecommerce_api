const { StatusCodes } = require("http-status-codes");

class ValidationException extends Error {
  constructor(
    message = "The request could not be processed due to invalid input",
    status = StatusCodes.BAD_REQUEST
  ) {
    super(message);
    this.status = status;
    this.errorType = "ValidationException";
  }
}

module.exports = ValidationException;
