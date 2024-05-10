const express = require("express");
const validate = require("../requests/validateRequest");
const asyncHandler = require("../utilities/asyncHandler");
const authenticate = require("../middlewares/authenticate");
const isAdmin = require("../middlewares/isAdmin");
const {
  addressValidationRules,
  updateProfileValidationRules,
} = require("../requests/profileRequest");
const { extractProfileData } = require("../utilities/utils");
const {
  upload,
  handleUploadError,
  validateImage,
} = require("../middlewares/multer");
const ForbiddenException = require("../exceptions/forbiddenException");

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

    return req.profileController.getAddress(res, userId);
  })
);

profileRoutes.get(
  "/:username/profile/suspend",
  authenticate,
  isAdmin,
  asyncHandler((req, res) => {
    const suspendUser = req?.params?.username;
    const adminUserId = req?.user?.id;

    return req.profileController.suspendUserProfile(
      res,
      adminUserId,
      suspendUser
    );
  })
);

profileRoutes.get(
  "/:username/profile/unsuspend",
  authenticate,
  isAdmin,
  asyncHandler((req, res) => {
    const suspendedUser = req?.params?.username;
    const adminUserId = req?.user?.id;

    return req.profileController.unSuspendUserProfile(
      res,
      adminUserId,
      suspendedUser
    );
  })
);

profileRoutes.put(
  "/:id/profile/update",
  authenticate,
  updateProfileValidationRules(),
  validate,
  (req, res, next) => {
    // Extract only the desired fields from the request body
    const data = extractProfileData(req.body);
    req.body = data; // Save the extracted data to the request object
    next(); // Proceed to the next middleware
  },
  upload.single("image"),
  validateImage,
  handleUploadError,
  asyncHandler((req, res, next) => {
    const userId = req?.params?.id;
    const data = req.body;
    const file = req?.file; // Get the uploaded file

    if (req?.user?.id != userId) {
      next(new ForbiddenException("Attempting to update different profile"));
    }
    return req.profileController.updateUserProfile(res, userId, data, file);
  })
);

profileRoutes.get(
  "/:id/profile",
  authenticate,
  asyncHandler((req, res, next) => {
    const userId = req?.params?.id;

    if (req?.user?.id != userId) {
      next(new ForbiddenException());
    }
    return req.profileController.getUserProfile(res, userId);
  })
);

profileRoutes.delete(
  "/:id/profile",
  authenticate,
  asyncHandler((req, res, next) => {
    const userId = req?.params?.id;

    if (req?.user?.id != userId) {
      next(new ForbiddenException());
    }
    return req.profileController.deleteUserAccount(res, userId);
  })
);

module.exports = profileRoutes;
