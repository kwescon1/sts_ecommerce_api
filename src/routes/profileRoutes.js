const express = require("express");
const validate = require("../requests/validateRequest");
const asyncHandler = require("../utilities/asyncHandler");
const authenticate = require("../middlewares/authenticate");
const isAdmin = require("../middlewares/isAdmin");
const { addressValidationRules } = require("../requests/profileRequest");

// Create a new router instance.
const profileRoutes = express.Router();

// Middleware to attach the profileController to the request.
profileRoutes.use((req, res, next) => {
  // Resolve profileController from the DI container attached to the request.
  req.profileController = req.container.resolve("profileController");
  next();
});

profileRoutes.post(
  "/profile/address",
  authenticate,
  addressValidationRules(),
  validate,
  asyncHandler((req, res) => {
    const userId = req?.user?.id;

    return req.profileController.storeAddress(req, res, userId);
  })
);

profileRoutes.get(
  "/profile/address",
  authenticate,
  asyncHandler((req, res) => {
    const userId = req?.user?.id;

    return req.profileController.getAddress(res, 4);
  })
);
module.exports = profileRoutes;
