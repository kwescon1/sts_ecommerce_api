const express = require("express");
const {
  storeCartValidationRules,
  updateCartValidationRules,
} = require("../requests/cartRequest");
const validate = require("../requests/validateRequest");
const asyncHandler = require("../utilities/asyncHandler");
const authenticate = require("../middlewares/authenticate");

// Create a new router instance.
const cartRoutes = express.Router();

// Middleware to attach the cartController to the request.
cartRoutes.use((req, res, next) => {
  // Resolve cartController from the DI container attached to the request.
  req.cartController = req.container.resolve("cartController");
  next();
});

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Endpoints for managing the shopping cart
 */

/**
 * @swagger
 * /api/v1/cart/add:
 *   post:
 *     summary: Add an item to the cart
 *     description: Adds an item to the user's current cart.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *                 description: The ID of the product to add to the cart
 *                 example: "0126c783-b7d6-4e00-b61e-67b91e3e0a92"
 *     responses:
 *       200:
 *         description: Item added to cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Item added to cart"
 *                 data:
 *                   type: object
 *                   properties:
 *                     item:
 *                       type: object
 *                       properties:
 *                         quantity:
 *                           type: integer
 *                           example: 1
 *                         is_ordered:
 *                           type: boolean
 *                           example: 0
 *                         id:
 *                           type: integer
 *                           example: 2
 *                         product_id:
 *                           type: string
 *                           example: "0126c783-b7d6-4e00-b61e-67b91e3e0a92"
 *                         cart_id:
 *                           type: string
 *                           example: "18074ddc-9c42-4576-8fb2-aaa0ae33e93c"
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-05-18T16:48:11.187Z"
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-05-18T16:48:11.187Z"
 *       409:
 *         description: Conflict - Product already exists in the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Product already exists in the cart. Consider updating the quantity instead."
 */

cartRoutes.post(
  "/add",
  authenticate,
  storeCartValidationRules(),
  validate,
  asyncHandler((req, res) => {
    const userId = req?.user?.id;

    return req.cartController.storeCartItem(req, res, userId);
  })
);

/**
 * @swagger
 * /api/v1/cart/{cart_id}:
 *   get:
 *     summary: Retrieve a user's cart by its ID
 *     description: Retrieves a user's cart and its items. Requires user authentication.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cart_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the cart to retrieve
 *     responses:
 *       200:
 *         description: User cart retrieved successfully
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
 *                     cart:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         user_id:
 *                           type: string
 *                         items:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               product_id:
 *                                 type: string
 *                               quantity:
 *                                 type: integer
 *                               price:
 *                                 type: number
 *                               product:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                   name:
 *                                     type: string
 *                                   sku:
 *                                     type: string
 *                                   cost_price:
 *                                     type: number
 *                         sub_total:
 *                           type: number
 *                         total_products:
 *                           type: integer
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               data:
 *                 cart:
 *                   id: "18074ddc-9c42-4576-8fb2-aaa0ae33e93c"
 *                   user_id: "fb600a66-e9cb-41e2-b5f8-70fd0cc331d4"
 *                   items:
 *                     - id: 2
 *                       product_id: "0126c783-b7d6-4e00-b61e-67b91e3e0a92"
 *                       quantity: 1
 *                       price: 1.06
 *                       product:
 *                         id: "0126c783-b7d6-4e00-b61e-67b91e3e0a92"
 *                         name: "Product 38"
 *                         sku: "SKU-202405185-0039"
 *                         cost_price: 1.06
 *                   sub_total: 1.06
 *                   total_products: 1
 *               message: "User cart retrieved successfully"
 *       404:
 *         description: Cart not found
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
 *               error: "Cart not found"
 */
cartRoutes.get(
  "/:cart_id",
  authenticate,
  asyncHandler((req, res) => req.cartController.getUserCart(req, res))
);

/**
 * @swagger
 * /api/v1/cart/{cart_id}/count:
 *   get:
 *     summary: Get the count of items in the cart.
 *     description: Retrieve the count of items in the user's current cart. Requires authentication.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cart_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the cart to count items for.
 *     responses:
 *       200:
 *         description: Count of items in the cart retrieved successfully.
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
 *                     item_count:
 *                       type: string
 *                       description: The count of items in the cart.
 *             examples:
 *               success:
 *                 summary: Count retrieved successfully
 *                 value:
 *                   success: true
 *                   message: "There are 2 items in cart"
 *                   data:
 *                     item_count: "2"
 *       404:
 *         description: Cart not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *             examples:
 *               error:
 *                 summary: Cart not found
 *                 value:
 *                   success: false
 *                   error: "Cart not found"
 */

cartRoutes.get(
  "/:cart_id/count",
  authenticate,
  asyncHandler((req, res) => req.cartController.getCartItemCount(req, res))
);

/**
 * @swagger
 * /api/v1/cart/{cart_id}/item/{product_id}/remove:
 *   delete:
 *     summary: Delete an item from the cart
 *     description: Deletes a specific item from the cart. Requires user authentication.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cart_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the cart
 *       - in: path
 *         name: product_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to be removed from the cart
 *     responses:
 *       200:
 *         description: Item deleted from cart
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
 *                     deleted:
 *                       type: boolean
 *                       example: true
 *                 message:
 *                   type: string
 *                   example: "Item deleted from cart"
 *       404:
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *                   example: "Cart item not found"
 */
cartRoutes.delete(
  "/:cart_id/item/:product_id/remove",
  authenticate,
  asyncHandler((req, res) => req.cartController.deleteItemFromCart(req, res))
);

/**
 * @swagger
 * /api/v1/cart/{cart_id}:
 *   delete:
 *     summary: Clear a user's cart
 *     description: Deletes all items in a user's cart and marks the cart as inactive. Requires user authentication.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cart_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the cart to clear
 *     responses:
 *       200:
 *         description: User cart cleared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: boolean
 *                       example: true
 *                 message:
 *                   type: string
 *                   example: "User cart cleared"
 *       404:
 *         description: Cart not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Cart not found"
 */

cartRoutes.delete(
  "/:cart_id",
  authenticate,
  asyncHandler((req, res) => req.cartController.clearUserCart(req, res))
);

/**
 * @swagger
 * /api/v1/cart/{cart_id}:
 *   put:
 *     summary: Update the quantity of a cart item
 *     description: Updates the quantity of a specific item in the user's cart. Requires authentication.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cart_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *                 description: The ID of the product to update
 *                 example: "15956c92-6b87-4bea-ae6c-4ab559ef374a"
 *               quantity:
 *                 type: integer
 *                 description: The new quantity for the product
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated
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
 *                     item:
 *                       type: object
 *                       properties:
 *                         price:
 *                           type: number
 *                         id:
 *                           type: integer
 *                         cart_id:
 *                           type: string
 *                         product_id:
 *                           type: string
 *                         quantity:
 *                           type: integer
 *                         is_ordered:
 *                           type: integer
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               data:
 *                 item:
 *                   price: 0
 *                   id: 5
 *                   cart_id: "b8028d80-4047-465a-97c6-c1edeeeb3400"
 *                   product_id: "15956c92-6b87-4bea-ae6c-4ab559ef374a"
 *                   quantity: 3
 *                   is_ordered: 0
 *               message: "Cart item updated"
 *       400:
 *         description: Bad request
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
 *               error: [
 *                 "Product not found"
 *               ]
 *       401:
 *         description: Unauthorized
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
 *               error: "Unauthorized"
 *       404:
 *         description: Not found
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
 *               error: "Cart item not found"
 */

cartRoutes.put(
  "/:cart_id",
  authenticate,
  updateCartValidationRules(),
  validate,
  asyncHandler((req, res) => {
    const cartId = req.params.cart_id;

    return req.cartController.updateItemQuantity(req, res, cartId);
  })
);

module.exports = cartRoutes;
