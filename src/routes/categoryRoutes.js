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

/**
 * @swagger
 * tags:
 *   name: Category Management
 *   description: Endpoints for managing categories
 */

/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     summary: Creates a new category in the system.
 *     tags: [Category Management]
 *     security:
 *       - bearerAuth: []
 *     description: This endpoint requires both authentication and admin privileges.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category.
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 description: Description of the category.
 *                 example: Category for electronic products
 *     responses:
 *       201:
 *         description: Category created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         description:
 *                           type: string
 *             example:
 *               success: true
 *               message: "Category created"
 *               data:
 *                 category:
 *                   id: "82eb4227-3e57-47f6-a9a0-92e975bc8f69"
 *                   name: "Electronics"
 *                   description: "Category for electronic products"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: array
 *                   items:
 *                     type: string
 *             example:
 *               success: false
 *               error:
 *                 - "Category name is required."
 *       403:
 *         description: Forbidden. Possible reasons include lack of admin privileges or access to the resource is denied for other reasons.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *             example:
 *               success: false
 *               error: "Forbidden. Admin privileges are required."
 */
categoryRoutes.post(
  "/",
  authenticate,
  isAdmin,
  storeCategoryValidationRules(),
  validate,
  asyncHandler((req, res) => req.categoryController.storeCategory(req, res))
);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   put:
 *     summary: Updates an existing category.
 *     tags: [Category Management]
 *     security:
 *       - bearerAuth: []
 *     description: This endpoint requires both authentication and admin privileges.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: The ID of the category to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category.
 *                 example: Books
 *               description:
 *                 type: string
 *                 description: Description of the category.
 *                 example: Category for books and literature
 *     responses:
 *       200:
 *         description: Category updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         description:
 *                           type: string
 *             example:
 *               success: true
 *               message: "Category updated"
 *               data:
 *                 category:
 *                   id: "82eb4227-3e57-47f6-a9a0-92e975bc8f69"
 *                   name: "Books"
 *                   description: "Category for books and literature"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: array
 *                   items:
 *                     type: string
 *             example:
 *               success: false
 *               error:
 *                 - "Name must not exceed 255 characters."
 *       403:
 *         description: Forbidden. Possible reasons include lack of admin privileges or access to the resource is denied for other reasons.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *             example:
 *               success: false
 *               error: "Forbidden. Admin privileges are required."
 */
categoryRoutes.put(
  "/:id",
  authenticate,
  isAdmin,
  updateCategoryValidationRules(),
  validate,
  asyncHandler((req, res) => {
    const categoryId = req.params.id;

    return req.categoryController.updateCategory(req, res, categoryId);
  })
);

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Retrieves all categories from the system.
 *     tags: [Category Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *             example:
 *               success: true
 *               message: "Categories retrieved successfully"
 *               data:
 *                 categories:
 *                   - id: "1"
 *                     name: "Electronics"
 *                     description: "Category for electronic products"
 *                   - id: "2"
 *                     name: "Books"
 *                     description: "Category for books and literature"
 */
categoryRoutes.get(
  "/",
  authenticate,
  asyncHandler((req, res) => req.categoryController.getCategories(res))
);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Retrieves a single category by its ID.
 *     tags: [Category Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: The ID of the category to retrieve.
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         description:
 *                           type: string
 *             example:
 *               success: true
 *               message: "Category retrieved successfully"
 *               data:
 *                 category:
 *                   id: "1"
 *                   name: "Electronics"
 *                   description: "Category for electronic products"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *             example:
 *               success: false
 *               error: "Category not found"
 */
categoryRoutes.get(
  "/:id",
  authenticate,
  asyncHandler((req, res) => {
    const categoryId = req.params.id;
    return req.categoryController.getCategory(res, categoryId);
  })
);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   delete:
 *     summary: Deletes an existing category.
 *     tags: [Category Management]
 *     security:
 *       - bearerAuth: []
 *     description: This endpoint requires both authentication and admin privileges.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: The ID of the category to delete.
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: boolean
 *             example:
 *               success: true
 *               message: "Category deleted successfully"
 *               data: true
 *       403:
 *         description: Forbidden. Possible reasons include lack of admin privileges or access to the resource is denied for other reasons.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *             example:
 *               success: false
 *               error: "Forbidden. Admin privileges are required."
 */
categoryRoutes.delete(
  "/:id",
  authenticate,
  isAdmin,
  asyncHandler((req, res) => {
    const categoryId = req.params.id;
    return req.categoryController.deleteCategory(res, categoryId);
  })
);

module.exports = categoryRoutes;
