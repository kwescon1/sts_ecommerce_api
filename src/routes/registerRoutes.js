const express = require("express");
const { userValidationRules } = require("../requests/registerRequest");
const validate = require("../requests/validateRequest");
const asyncHandler = require("../utilities/asyncHandler");

const authenticate = require("../middlewares/authenticate");

// Create a new router instance.
const registerRoutes = express.Router();

// Middleware to attach the registerController to the request.
registerRoutes.use((req, res, next) => {
  // Resolve registerController from the DI container attached to the request.
  req.registerController = req.container.resolve("registerController");
  next();
});

// Apply the authenticate middleware to all routes except '/register'
registerRoutes.use(authenticate(["/api/v1/auth/register"]));

// Register new user.
registerRoutes.post(
  "/register",
  userValidationRules(),
  validate,
  asyncHandler((req, res) => req.registerController.register(req, res))
);

module.exports = registerRoutes;
