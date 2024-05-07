const express = require("express");
const {
  storeCategoryValidationRules,
  updateCategoryValidationRules,
} = require("../requests/categoryRequest");
const validate = require("../requests/validateRequest");
const asyncHandler = require("../utilities/asyncHandler");
const authenticate = require("../middlewares/authenticate");
const isAdmin = require("../middlewares/isAdmin");

// Create a new router instance.
const categoryRoutes = express.Router();

// Middleware to attach the categoryController to the request.
categoryRoutes.use((req, res, next) => {
  // Resolve categoryController from the DI container attached to the request.
  req.categoryController = req.container.resolve("categoryController");
  next();
});

categoryRoutes.post(
  "/",
  authenticate,
  isAdmin,
  storeCategoryValidationRules(),
  validate,
  asyncHandler((req, res) => req.categoryController.storeCategory(req, res))
);

categoryRoutes.put(
  "/:id",
  authenticate,
  isAdmin,
  updateCategoryValidationRules(),
  validate,
  asyncHandler((req, res) => {
    const categoryId = req.params.id;

    req.categoryController.updateCategory(req, res, categoryId);
  })
);

categoryRoutes.get(
  "/",
  authenticate,
  asyncHandler((req, res) => req.categoryController.getCategories(res))
);

categoryRoutes.get(
  "/:id",
  authenticate,
  asyncHandler((req, res) => {
    const categoryId = req.params.id;
    req.categoryController.getCategory(res, categoryId);
  })
);

categoryRoutes.delete(
  "/:id",
  authenticate,
  isAdmin,
  asyncHandler((req, res) => {
    const categoryId = req.params.id;
    req.categoryController.deleteCategory(res, categoryId);
  })
);

module.exports = categoryRoutes;
