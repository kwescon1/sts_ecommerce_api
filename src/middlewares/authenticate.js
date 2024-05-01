const { StatusCodes } = require("http-status-codes");
const { verifyToken } = require("../utilities/utils");

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
      return res.error("Unauthorized Action", StatusCodes.UNAUTHORIZED);
    }

    try {
      const decoded = verifyToken(token);
      req.user = decoded; //Attach user information to request
      next();
    } catch (error) {
      return res.error("Invalid token", StatusCodes.FORBIDDEN);
    }
  };

module.exports = authenticate;
