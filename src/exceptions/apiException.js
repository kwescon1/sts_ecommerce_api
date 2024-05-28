const { StatusCodes } = require("http-status-codes");

class ApiException extends Error {
  constructor(
    message = "Api Error Occured",
    status = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.status = status;
    this.errorType = "ApiException";
  }
}

module.exports = ApiException;
