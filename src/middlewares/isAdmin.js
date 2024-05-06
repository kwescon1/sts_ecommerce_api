const ForbiddenException = require("../exceptions/forbiddenException");

const isAdmin = (req, res, next) => {
  // Check if the user is an admin
  if (req.user?.is_admin) {
    next(); // Continue to next middleware if user is an admin
  } else {
    // If user is not an admin, throw forbidden exception
    return next(new ForbiddenException("Unauthorized Action - Admins only"));
  }
};

module.exports = isAdmin;
