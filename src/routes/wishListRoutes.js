const express = require("express");
const {
  addToWishlistValidationRules,
  removeFromWishlistValidationRules,
} = require("../requests/wishListRequest");
const asyncHandler = require("../utilities/asyncHandler");
const validate = require("../requests/validateRequest");
const wishlistRoutes = express.Router();
const authenticate = require("../middlewares/authenticate");

// Middleware to attach the profileController to the request.
wishlistRoutes.use((req, res, next) => {
  req.wishlistController = req.container.resolve("wishlistController");
  next();
});

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: This section of the API allows users to manage their wishlists. Users can create, view, edit, and delete wishlists containing items they'd like to purchase or track later.
 */

/**
 * @swagger
 * /api/v1/user/wishlist/add:
 *   post:
 *     summary: Add product to wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID of the user
 *               product_id:
 *                 type: string
 *                 description: ID of the product
 *             example:
 *               user_id: "uuid"
 *               product_id: "uuid"
 *     responses:
 *       201:
 *         description: Product added to wishlist successfully
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
 *                     product_id:
 *                       type: string
 *                     user_id:
 *                       type: string
 *             example:
 *               success: true
 *               message: "Product added to wishlist"
 *               data:
 *                 product_id: "0342c138-c21e-45a2-95d3-844660a4b70f"
 *                 user_id: "3d1eedb1-0127-4558-9bd6-762ac613df2b"
 *       409:
 *         description: Product is already in the wishlist
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
 *               error: "Product exists already in wishlist"
 *       500:
 *         description: Server error
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
 *               error: "Server error"
 */
wishlistRoutes.post(
  "/wishlist/add",
  authenticate,
  addToWishlistValidationRules(),
  validate,
  asyncHandler((req, res) => {
    return req.wishlistController.addToWishlist(req, res);
  })
);

/**
 * @swagger
 * /api/v1/user/{user_id}/wishlist:
 *   get:
 *     summary: Get user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     wishlist:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         user_id:
 *                           type: string
 *                         products:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               sku:
 *                                 type: string
 *                               category_id:
 *                                 type: integer
 *                               last_updated_restock_level:
 *                                 type: integer
 *                               current_stock_level:
 *                                 type: integer
 *             example:
 *               success: true
 *               data:
 *                 wishlist:
 *                   id: 1
 *                   user_id: "3d1eedb1-0127-4558-9bd6-762ac613df2b"
 *                   products:
 *                     - id: "0342c138-c21e-45a2-95d3-844660a4b70f"
 *                       name: "Product 10"
 *                       sku: "SKU0010"
 *                       category_id: 3
 *                       last_updated_restock_level: 7
 *                       current_stock_level: 53
 *                     - id: "11c1e777-0d5e-4431-b01e-2fec615b6061"
 *                       name: "Product 37"
 *                       sku: "SKU0037"
 *                       category_id: 1
 *                       last_updated_restock_level: 65
 *                       current_stock_level: 87
 *               message: "Wishlist retrieved successfully"
 *       500:
 *         description: Server error
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
 *               error: "Server error"
 */
wishlistRoutes.get(
  "/:user_id/wishlist",
  authenticate,
  asyncHandler((req, res) => req.wishlistController.getWishlist(req, res))
);

/**
 * @swagger
 * /api/v1/user/{user_id}/wishlist/product/{product_id}:
 *   delete:
 *     summary: Remove product from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *       - in: path
 *         name: product_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Product removed from wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               data: true
 *               message: "Product removed from wishlist"
 *       404:
 *         description: Product not found in wishlist
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
 *               error: "Product not found in wishlist."
 *       500:
 *         description: Server error
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
 *               error: "Server error"
 */
wishlistRoutes.delete(
  "/:user_id/wishlist/product/:product_id",
  authenticate,
  removeFromWishlistValidationRules(),
  validate,
  asyncHandler((req, res) =>
    req.wishlistController.removeFromWishlist(req, res)
  )
);

module.exports = wishlistRoutes;
