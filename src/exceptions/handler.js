// Import the logger
const { StatusCodes } = require("http-status-codes");
const logger = require("../config/logging");

/**
 * Error handling middleware class to log errors and send appropriate responses.
 */
class ErrorHandler {
  /**
   * Handles errors by logging and responding with the appropriate error message and status code.
   * @param {Object} err - The error object.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} next - Callback to pass control to the next middleware function.
   */
  handle(err, req, res, next) {
    // Extract useful error information
    const errorInfo = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      error: err.message,
      stack: err.stack.split("\n")[0], // Getting the first line of the stack trace
    };

    // Log the error details
    logger.error(JSON.stringify(errorInfo));

    // Switch case on the error type
    switch (err.constructor.name) {
      case "NotFoundException":
        res.notFound(err.message);
        break;

      case "ValidationException":
        res.error(err.message, err.status);
        break;
      // Add more cases as needed for other custom errors
      default:
        // Handle unexpected errors
        res.error(
          err.message || "Internal Server Error",
          err.status || StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
  }
}

// Export the ErrorHandler class instance
module.exports = new ErrorHandler();
