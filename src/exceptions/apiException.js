const { StatusCodes } = require("http-status-codes");

class ApiException extends Error {
  constructor(message = "Api Error Occured", status) {
    super(message);
    this.status = status;
    this.errorType = "ApiException";
  }
}

module.exports = ApiException;
