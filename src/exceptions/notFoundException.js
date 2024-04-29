const { StatusCodes } = require("http-status-codes");

class NotFoundException extends Error {
  constructor(message = "Resource Not Found", status = StatusCodes.NOT_FOUND) {
    super(message);
    this.status = status;
    this.errorType = "NotFoundException";
  }
}

module.exports = NotFoundException;
