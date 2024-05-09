const { verifyToken } = require("../utilities/utils");
const UnauthorizedException = require("../exceptions/unauthorizedException");
const ForbiddenException = require("../exceptions/forbiddenException");
const redisClient = require("../services/redisService");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  // Retrieve token from header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return next(new UnauthorizedException());
  }

  // Check if token is blacklisted
  const isBlacklisted = await redisClient.get(`blacklist_${token}`);
  if (isBlacklisted) {
    return next(new UnauthorizedException());
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Attach user information to request

    // Check if user has been suspended
    if (req.user?.is_suspended) {
      return next(new ForbiddenException("Suspended User"));
    }

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      // Handle expired token error
      return next(new UnauthorizedException());
    } else {
      // Handle other errors
      return next(new ForbiddenException("Invalid Token"));
    }
  }
};

module.exports = authenticate;
