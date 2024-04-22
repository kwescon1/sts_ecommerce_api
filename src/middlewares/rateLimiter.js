import rateLimit from "express-rate-limit";

/**
 * Class to configure and apply rate limiting in an Express application.
 */
class RateLimiter {
  /**
   * Creates an instance of a rate limiter.
   * @param {Object} options Configuration options for the rate limiter.
   * @param {number} options.windowMs - Duration in milliseconds for which to limit requests. Default is 60000 ms (1 minute).
   * @param {number} options.max - Maximum number of requests allowed during the windowMs period per IP. Default is 60 requests.
   * @param {boolean} options.standardHeaders - Whether to return rate limit info in the `RateLimit-*` headers.
   * @param {boolean} options.legacyHeaders - Whether to disable the `X-RateLimit-*` headers. Recommended to set to `false` for newer header conventions.
   * @param {string} options.message - Message returned when rate limit is exceeded.
   */
  constructor(options) {
    this.limiter = rateLimit({
      windowMs: options?.windowMs || 60 * 1000, // 1 minute
      max: options?.max || 60, // Limit each IP to 60 requests per windowMs
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      message: options?.message || "Too many requests, please try again later.",
    });
  }

  /**
   * Getter to retrieve the middleware function configured with the rate limit.
   * @returns {Function} Middleware function to use in Express applications.
   */
  get middleware() {
    return this.limiter;
  }
}

export default RateLimiter;
