const express = require("express");
const validate = require("../requests/validateRequest");
const asyncHandler = require("../utilities/asyncHandler");
const authenticate = require("../middlewares/authenticate");
const isAdmin = require("../middlewares/isAdmin");
const {
  stockValidationRules,
  stockUpdateValidationRules,
} = require("../requests/stockRequest");

// Create a new router instance.
const stockRoutes = express.Router();

// Middleware to attach the stockController to the request.
stockRoutes.use((req, res, next) => {
  // Resolve stockController from the DI container attached to the request.
  req.stockController = req.container.resolve("stockController");
  next();
});

/**
 * @swagger
 * tags:
 *   name: Product Stock
 *   description: Endpoints for managing product stock
 */

/**
 * @swagger
 * /api/v1/stocks/product/{product_id}:
 *   get:
 *     summary: Retrieve stock information for a specific product
 *     description: Fetches stock information for a given product ID. Requires admin authorization.
 *     tags: [Product Stock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: product_id
 *         in: path
 *         description: ID of the product to retrieve stock information for
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Product stock retrieved successfully
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
 *                     cost_price:
 *                       type: number
 *                       format: float
 *                       example: 3.49
 *                     retail_price:
 *                       type: number
 *                       format: float
 *                       example: 19.58
 *                     id:
 *                       type: integer
 *                       example: 7
 *                     product_id:
 *                       type: string
 *                       example: "05f45509-fe25-4060-b8ff-34bf275721d5"
 *                     quantity:
 *                       type: integer
 *                       example: 20
 *                     comment:
 *                       type: string
 *                       example: "Initial stock for Product 7"
 *                     product:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "05f45509-fe25-4060-b8ff-34bf275721d5"
 *                         name:
 *                           type: string
 *                           example: "Product 7"
 *                         sku:
 *                           type: string
 *                           example: "SKU-202405162-0008"
 *                         category_id:
 *                           type: integer
 *                           example: 2
 *                         last_updated_restock_level:
 *                           type: integer
 *                           example: 99
 *                         current_stock_level:
 *                           type: integer
 *                           example: 27
 *                 message:
 *                   type: string
 *                   example: "Product stock retrieved successfully"
 *       404:
 *         description: Product stock not found
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
 *                   example: "Product stock not found"
 *       403:
 *         description: Forbidden - Admin authorization required
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
 *                   example: "Forbidden - Admin authorization required"
 */
stockRoutes.get(
  "/:product_id",
  authenticate,
  isAdmin,
  asyncHandler((req, res) => {
    const productId = req.params.product_id;

    return req.stockController.getProductStock(res, productId);
  })
);
/**
 * @swagger
 * /api/v1/stocks/product:
 *   post:
 *     summary: Create stock for a specific product
 *     description: Creates stock information for a given product ID. Requires admin authorization.
 *     tags: [Product Stock]
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
 *                 description: ID of the product to create stock for
 *                 example: "0342c138-c21e-45a2-95d3-844660a4b70f"
 *               cost_price:
 *                 type: number
 *                 format: float
 *                 description: The cost price of the product
 *                 example: 55.00
 *               retail_price:
 *                 type: number
 *                 format: float
 *                 description: The retail price of the product
 *                 example: 15.99
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product
 *                 example: 50
 *               comment:
 *                 type: string
 *                 description: Optional comment for the stock
 *                 example: "Optional comment here"
 *     responses:
 *       201:
 *         description: Product stock created
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
 *                   example: Product stock created
 *                 data:
 *                   type: object
 *                   properties:
 *                     cost_price:
 *                       type: number
 *                       format: float
 *                       example: 55
 *                     retail_price:
 *                       type: number
 *                       format: float
 *                       example: 15.99
 *                     id:
 *                       type: integer
 *                       example: 52
 *                     product_id:
 *                       type: string
 *                       example: "e33bd949-d637-46e2-8d1d-148133c4e236"
 *                     quantity:
 *                       type: integer
 *                       example: 50
 *                     comment:
 *                       type: string
 *                       example: "Optional comment here"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-05-18T11:53:43.466Z"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-05-18T11:53:43.466Z"
 *       400:
 *         description: Bad Request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
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
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden - Admin authorization required
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
 *                   example: Forbidden - Admin authorization required
 *       409:
 *         description: Conflict - Stock already exists for the product
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
 *                   example: Product already has stock. Consider an update instead
 */
stockRoutes.post(
  "/",
  authenticate,
  isAdmin,
  stockValidationRules(),
  validate,
  asyncHandler((req, res) => {
    return req.stockController.storeProductStock(req, res);
  })
);

/**
 * @swagger
 * /api/v1/stocks/product/{product_id}:
 *   delete:
 *     summary: Delete product stock
 *     description: Deletes the stock record of a product and updates the product's current stock level. Requires admin privileges.
 *     tags: [Stocks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product_id
 *         schema:
 *           type: string
 *           required: true
 *           description: The ID of the product whose stock is to be deleted
 *     responses:
 *       200:
 *         description: Product stock deleted successfully
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
 *               message: Product stock deleted successfully
 *       404:
 *         description: Product stock not found
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
 *               error: Product stock not found
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
 *               error: Unauthorized
 *       403:
 *         description: Forbidden
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
 *               error: Forbidden
 */
stockRoutes.delete(
  "/:product_id",
  authenticate,
  isAdmin,
  asyncHandler((req, res) => {
    const productId = req.params.product_id;

    return req.stockController.deleteProductStock(res, productId);
  })
);

/**
 * @swagger
 * /api/v1/stocks/product:
 *   get:
 *     summary: Retrieve all product stocks
 *     description: Fetches all stocks for products. Requires admin authorization.
 *     tags: [Product Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of product stocks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       cost_price:
 *                         type: number
 *                         format: float
 *                         example: 10.57
 *                       retail_price:
 *                         type: number
 *                         format: float
 *                         example: 63.34
 *                       id:
 *                         type: integer
 *                         example: 3
 *                       product_id:
 *                         type: string
 *                         example: "feb5b446-0499-46d2-925e-1e6f94aa0161"
 *                       quantity:
 *                         type: integer
 *                         example: 65
 *                       comment:
 *                         type: string
 *                         example: "Initial stock for Product 3"
 *                       product:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "feb5b446-0499-46d2-925e-1e6f94aa0161"
 *                           name:
 *                             type: string
 *                             example: "Product 3"
 *                           sku:
 *                             type: string
 *                             example: "SKU-202405161-0004"
 *                           category_id:
 *                             type: integer
 *                             example: 1
 *                           last_updated_restock_level:
 *                             type: integer
 *                             example: 12
 *                           current_stock_level:
 *                             type: integer
 *                             example: 86
 *       401:
 *         description: Unauthorized - Invalid or missing token
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
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden - Admin authorization required
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
 *                   example: Forbidden - Admin authorization required
 */
stockRoutes.get(
  "/",
  authenticate,
  isAdmin,
  asyncHandler((req, res) => {
    return req.stockController.getStocks(res);
  })
);

/**
 * @swagger
 * /api/v1/stocks/product/deleted/all:
 *   get:
 *     summary: Get all deleted product stocks
 *     description: Retrieves all deleted product stocks. Requires admin privileges.
 *     tags: [Stocks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retrieved deleted products stock
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
 *                     deleted_stocks:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           cost_price:
 *                             type: number
 *                             format: float
 *                           retail_price:
 *                             type: number
 *                             format: float
 *                           id:
 *                             type: integer
 *                           product_id:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *                           comment:
 *                             type: string
 *                           deleted_at:
 *                             type: string
 *                             format: date-time
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                           updated_at:
 *                             type: string
 *                             format: date-time
 *                           product:
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
 *                 deleted_stocks:
 *                   - cost_price: 13.05
 *                     retail_price: 78.72
 *                     id: 4
 *                     product_id: 4597bca2-044a-4249-b33f-d7a7060a3f91
 *                     quantity: 95
 *                     comment: Initial stock for Product 4
 *                     deleted_at: 2024-05-18T13:00:39.000Z
 *                     created_at: 2024-05-16T16:07:05.000Z
 *                     updated_at: 2024-05-18T13:00:39.000Z
 *                     product:
 *                       id: 4597bca2-044a-4249-b33f-d7a7060a3f91
 *                       name: Product 4
 *                       sku: SKU-202405163-0005
 *                       category_id: 3
 *                       last_updated_restock_level: 88
 *                       current_stock_level: 0
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
 *               error: Unauthorized
 *       403:
 *         description: Forbidden
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
 *               error: Forbidden
 */
stockRoutes.get(
  "/deleted/all",
  authenticate,
  isAdmin,
  asyncHandler((req, res) => {
    return req.stockController.getSoftDeletedProductsStock(res);
  })
);

/**
 * @swagger
 * /api/v1/stocks/product/{product_id}/force/delete:
 *   delete:
 *     summary: Force delete product stock
 *     description: Force deletes the stock record of a product. Requires admin privileges.
 *     tags: [Product Stock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product_id
 *         schema:
 *           type: string
 *           required: true
 *           description: The ID of the product whose stock is to be force deleted
 *     responses:
 *       200:
 *         description: Product stock deleted completely
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
 *               message: Product stock deleted completely
 *       404:
 *         description: Product stock not found
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
 *               error: Product stock not found
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
 *               error: Unauthorized
 *       403:
 *         description: Forbidden
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
 *               error: Forbidden
 */
stockRoutes.delete(
  "/:product_id/force/delete",
  authenticate,
  isAdmin,
  asyncHandler((req, res) => {
    const productId = req.params.product_id;

    return req.stockController.forceDeleteProductStock(res, productId);
  })
);

/**
 * @swagger
 * /api/v1/stocks/product/{product_id}:
 *   put:
 *     summary: Update product stock
 *     description: Updates the stock information for a specific product. Requires admin authorization.
 *     tags: [Product Stock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product_id
 *         schema:
 *           type: string
 *           example: "e33bd949-d637-46e2-8d1d-148133c4e236"
 *         required: true
 *         description: The ID of the product to update stock for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cost_price:
 *                 type: number
 *                 format: float
 *                 example: 30
 *               retail_price:
 *                 type: number
 *                 format: float
 *                 example: 20
 *               quantity:
 *                 type: integer
 *                 example: 50
 *               comment:
 *                 type: string
 *                 example: "Optional comment here"
 *     responses:
 *       200:
 *         description: Product stock updated successfully
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
 *                     stock:
 *                       type: object
 *                       properties:
 *                         cost_price:
 *                           type: number
 *                         retail_price:
 *                           type: number
 *                         id:
 *                           type: integer
 *                         product_id:
 *                           type: string
 *                         quantity:
 *                           type: integer
 *                         comment:
 *                           type: string
 *                         product:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *                             sku:
 *                               type: string
 *                             category_id:
 *                               type: integer
 *                             last_updated_restock_level:
 *                               type: integer
 *                             current_stock_level:
 *                               type: integer
 *             example:
 *               success: true
 *               data:
 *                 stock:
 *                   cost_price: 30
 *                   retail_price: 20
 *                   id: 52
 *                   product_id: "e33bd949-d637-46e2-8d1d-148133c4e236"
 *                   quantity: 100
 *                   comment: "Optional comment here"
 *                   product:
 *                     id: "e33bd949-d637-46e2-8d1d-148133c4e236"
 *                     name: "Product 2"
 *                     sku: "SKU-202405165-0003"
 *                     category_id: 5
 *                     last_updated_restock_level: 50
 *                     current_stock_level: 100
 *                 message: "Product stock updated successfully"
 *       404:
 *         description: Product stock not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *                 example:
 *                   success: false
 *                   error: "Product stock not found"
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
 *                 example:
 *                   success: false
 *                   error: "Unauthorized"
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *                 example:
 *                   success: false
 *                   error: "Forbidden"
 */
stockRoutes.put(
  "/:product_id",
  authenticate,
  isAdmin,
  stockUpdateValidationRules(),
  validate,
  asyncHandler((req, res) => {
    const productId = req.params.product_id;

    return req.stockController.updateProductStock(req, res, productId);
  })
);

module.exports = stockRoutes;
