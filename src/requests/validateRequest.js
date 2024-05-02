const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

/**
 * This middleware function checks the result of express-validator's validation
 * and handles any validation errors by sending an appropriate response.
 * If no errors are found, it calls `next()` to pass control to the next middleware or route handler.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((error) => error.msg);

    return res.error(messages, StatusCodes.BAD_REQUEST);
  }
  next();
};

module.exports = validate;
