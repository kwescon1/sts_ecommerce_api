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

// login new user.
loginRoutes.post(
  "/login",
  loginValidationRules(),
  validate,
  asyncHandler((req, res) => req.loginController.login(req, res))
);

loginRoutes.post(
  "/logout",
  authenticate,
  asyncHandler((req, res) => req.loginController.logout(req, res))
);

module.exports = loginRoutes;
