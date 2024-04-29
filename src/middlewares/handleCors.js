const cors = require("cors");
/**
 * Middleware class to configure and enable Cross-Origin Resource Sharing (CORS).
 */
class CorsMiddleware {
  constructor(options) {
    // Define the CORS options
    this.options = options || this.defaultOptions();
  }

  /**
   * Provides default CORS configuration options.
   * Customize these options based on your security requirements and environment.
   *
   * @returns {Object} The default CORS configuration options.
   */
  defaultOptions() {
    return {
      origin: "*", // Allow all origins
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
      preflightContinue: false, // Don't pass the request to next middleware if preflight request
      optionsSuccessStatus: 204, // Status to return for successful OPTIONS requests
    };
  }

  /**
   * Gets the configured CORS middleware for use in Express.
   *
   * @returns {Function} The CORS middleware configured with the specified options.
   */
  get middleware() {
    return cors(this.options);
  }
}

module.exports = CorsMiddleware;
