const { StatusCodes } = require("http-status-codes");

class UnauthorizedException extends Error {
  constructor(
    message = "Unauthorized Action",
    status = StatusCodes.UNAUTHORIZED
  ) {
    super(message);
    this.status = status;
    this.errorType = "UnauthorizedException";
  }
}

module.exports = UnauthorizedException;
