const express = require("express");
const asyncHandler = require("../utilities/asyncHandler");
const { tokenValidationRules } = require("../requests/refreshTokenRequest");
const validate = require("../requests/validateRequest");

// Create a new router instance.
const tokenRoutes = express.Router();

// Middleware to attach the loginController to the request.
tokenRoutes.use((req, res, next) => {
  // Resolve tokenController from the DI container attached to the request.
  req.tokenController = req.container.resolve("tokenController");
  next();
});

tokenRoutes.post(
  "/refresh-token",
  tokenValidationRules(),
  validate,
  asyncHandler((req, res) => req.tokenController.refreshAccessToken(req, res))
);

module.exports = tokenRoutes;
