const express = require("express");
const { loginValidationRules } = require("../requests/loginRequest");
const validate = require("../requests/validateRequest");
const asyncHandler = require("../utilities/asyncHandler");
const authenticate = require("../middlewares/authenticate");

// Create a new router instance.
const loginRoutes = express.Router();

// Middleware to attach the loginController to the request.
loginRoutes.use((req, res, next) => {
  // Resolve loginController from the DI container attached to the request.
  req.loginController = req.container.resolve("loginController");
  next();
});

// Apply the authenticate middleware to all routes except '/login'
loginRoutes.use(authenticate(["/api/v1/auth/login"]));

// Register new user.
loginRoutes.post(
  "/login",
  loginValidationRules(),
  validate,
  asyncHandler((req, res) => req.loginController.login(req, res))
);

module.exports = loginRoutes;
