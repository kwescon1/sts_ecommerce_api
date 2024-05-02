const { StatusCodes } = require("http-status-codes");
const { verifyToken } = require("../utilities/utils");
const UnauthorizedException = require("../exceptions/unauthorizedException");
const ForbiddenException = require("../exceptions/forbiddenException");

const authenticate =
  (except = []) =>
  (req, res, next) => {
    // If the route is in the except array, skip authentication
    if (except.includes(req.originalUrl)) {
      return next();
    }

    // Retrieve token from header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const decoded = verifyToken(token);
      req.user = decoded; //Attach user information to request

      // check if user has been suspended

      if (req.user?.is_suspended) {
        throw new ForbiddenException("Suspended User");
      }

      next();
    } catch (error) {
      throw new ForbiddenException("Invalid Token");
    }
  };

module.exports = authenticate;
