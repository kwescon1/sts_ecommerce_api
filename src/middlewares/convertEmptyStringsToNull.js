class ConvertEmptyStringsToNull {
  /**
   * Processes the incoming request to convert all empty string values in
   * req.query and req.body to null.
   *
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @param {Function} next - The next middleware function in the stack.
   */
  handle(req, res, next) {
    // Convert empty strings in req.query to null
    Object.keys(req.query).forEach((key) => {
      if (req.query[key] === "") {
        req.query[key] = null;
      }
    });

    // Convert empty strings in req.body to null
    if (req.body) {
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] === "") {
          req.body[key] = null;
        }
      });
    }

    next();
  }
}

export default new ConvertEmptyStringsToNull();
