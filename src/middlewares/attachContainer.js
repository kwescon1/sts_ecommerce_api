/**
 * Class for attaching the dependency injection container to the request.
 */
class AttachContainerMiddleware {
  /**
   * Creates an instance of AttachContainerMiddleware.
   * @param {Object} container - The dependency injection container.
   */
  constructor(container) {
    this.container = container;
  }

  /**
   * Middleware handler for attaching the container to the request.
   * This method will be called with the Express request, response, and next function.
   * It attaches the DI container to the request object for use in subsequent middleware and controllers.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @param {Function} next - The next middleware function in the stack.
   */
  handle = (req, res, next) => {
    // Attach the container to the request object
    req.container = this.container;

    // Proceed to the next middleware in the stack
    next();
  };
}

module.exports = AttachContainerMiddleware;
