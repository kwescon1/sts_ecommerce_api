const express = require("express");
const {
  userValidationRules,
  validate,
} = require("../requests/registerRequest");
const asyncHandler = require("../utilities/asyncHandler");

const authenticate = require("../middlewares/authenticate");

// Create a new router instance.
const authRoutes = express.Router();

// Middleware to attach the registerController to the request.
authRoutes.use((req, res, next) => {
  // Resolve registerController from the DI container attached to the request.
  req.registerController = req.container.resolve("registerController");
  next();
});

// Apply the authenticate middleware to all routes except '/register'
authRoutes.use(authenticate(["/api/v1/auth/register"]));

// Route to create a new user.
authRoutes.post(
  "/register",
  userValidationRules(),
  validate,
  asyncHandler((req, res) => req.registerController.register(req, res))
);

module.exports = authRoutes;
