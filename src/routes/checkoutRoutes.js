const express = require("express");
const { processCartValidationRules } = require("../requests/cartRequest");
const validate = require("../requests/validateRequest");
const asyncHandler = require("../utilities/asyncHandler");
const authenticate = require("../middlewares/authenticate");
const { verifyTransaction } = require("../requests/transactionRequest");

// Create a new router instance.
const checkoutRoutes = express.Router();

// Middleware to attach the checkoutController to the request.
checkoutRoutes.use((req, res, next) => {
  // Resolve checkoutController from the DI container attached to the request.
  req.checkoutController = req.container.resolve("checkoutController");
  next();
});

/**
 * @swagger
 * tags:
 *   name: Checkout
 *   description: Endpoints for managing the checking out
 */

/**
 * @swagger
 * /api/v1/checkout/cart/{cart_id}/order/summary:
 *   get:
 *     summary: Get order summary based on the items in the cart
 *     description: Retrieves the order summary based on the items in the specified cart. Requires authentication.
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cart_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the cart for which to retrieve the order summary.
 *     responses:
 *       200:
 *         description: Order summary successfully retrieved.
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
 *                     order_summary:
 *                       type: object
 *                       properties:
 *                         data:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "b8028d80-4047-465a-97c6-c1edeeeb3400"
 *                             user_id:
 *                               type: string
 *                               example: "fb600a66-e9cb-41e2-b5f8-70fd0cc331d4"
 *                             items:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: integer
 *                                     example: 4
 *                                   product_id:
 *                                     type: string
 *                                     example: "1cce3557-44ae-480f-8c0f-fc71e1ab8e21"
 *                                   quantity:
 *                                     type: integer
 *                                     example: 3
 *                                   price:
 *                                     type: number
 *                                     format: float
 *                                     example: 144
 *                                   product:
 *                                     type: object
 *                                     properties:
 *                                       id:
 *                                         type: string
 *                                         example: "1cce3557-44ae-480f-8c0f-fc71e1ab8e21"
 *                                       name:
 *                                         type: string
 *                                         example: "Product 43"
 *                                       sku:
 *                                         type: string
 *                                         example: "SKU-202405181-0044"
 *                                       category_id:
 *                                         type: integer
 *                                         example: 1
 *                                       cost_price:
 *                                         type: number
 *                                         format: float
 *                                         example: 48
 *                             sub_total:
 *                               type: number
 *                               format: float
 *                               example: 258.36
 *                             total_products:
 *                               type: integer
 *                               example: 2
 *                             charge:
 *                               type: number
 *                               format: float
 *                               example: 7.79
 *                             total_charge:
 *                               type: number
 *                               format: float
 *                               example: 266.15
 *                             user_address:
 *                               type: object
 *                               properties:
 *                                 address:
 *                                   type: string
 *                                   example: null
 *                                 message:
 *                                   type: string
 *                                   example: "User address not found"
 *       401:
 *         description: Unauthorized. Authentication credentials were missing or incorrect.
 */

checkoutRoutes.get(
  "/:cart_id/order/summary",
  authenticate,
  asyncHandler((req, res) => {
    const userId = req?.user?.id;

    return req.checkoutController.checkoutSummary(req, res, userId);
  })
);

/**
 * @swagger
 * /api/v1/checkout/cart/{cart_id}/order/checkout:
 *   post:
 *     summary: Initiate the checkout process for the items in the cart
 *     description: Initiates the checkout process for the items in the specified cart. Requires user authentication.
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cart_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the cart for which to initiate the checkout process.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               billing_is_shipping:
 *                 type: boolean
 *                 description: Boolean indicating if billing address is the same as shipping address.
 *               street_address:
 *                 type: string
 *                 description: Street address for shipping if different from billing address.
 *               city:
 *                 type: string
 *                 description: City for shipping if different from billing address.
 *               state:
 *                 type: string
 *                 description: State for shipping if different from billing address.
 *               postal_code:
 *                 type: string
 *                 description: Postal code for shipping if different from billing address.
 *               country:
 *                 type: string
 *                 description: Country for shipping if different from billing address.
 *     responses:
 *       200:
 *         description: Checkout process initiated successfully.
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
 *                     client_secret:
 *                       type: string
 *                       example: "pi_3PJn72Dm1QPN74Xl1BEyXL3K_secret_tBl92eJqtWwd2V173b3UPrN7S"
 *                 message:
 *                   type: string
 *                   example: "User checkout in progress"
 *       400:
 *         description: Failed to create payment intent.
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
 *                   example: "Failed to create payment intent"
 *       401:
 *         description: Unauthorized. User authentication credentials were missing or incorrect.
 *       409:
 *         description: Conflict. User order not found.
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
 *                   example: "User order not found"
 */

checkoutRoutes.post(
  "/:cart_id/order/checkout",
  authenticate,
  processCartValidationRules(),
  validate,
  asyncHandler((req, res) => {
    const userId = req?.user?.id;

    return req.checkoutController.checkoutOrder(req, res, userId);
  })
);

checkoutRoutes.post(
  "/confirm-payment",
  authenticate,
  verifyTransaction(),
  validate,
  asyncHandler((req, res) => {
    return req.checkoutController.confirmOrder(req, res);
  })
);

module.exports = checkoutRoutes;
