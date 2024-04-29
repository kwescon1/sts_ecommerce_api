// utils/asyncHandler.js

/**
 * Utility function to wrap asynchronous route handlers and pass errors to the next function.
 * This allows for cleaner async route handlers, by avoiding the need for try/catch blocks.
 * @param {Function} fn - The asynchronous route handler function.
 * @returns {Function} A wrapped route handler function.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
