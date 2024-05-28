const express = require("express");
const validate = require("../requests/validateRequest");
const asyncHandler = require("../utilities/asyncHandler");
const authenticate = require("../middlewares/authenticate");
const isAdmin = require("../middlewares/isAdmin");
const {
  productValidationRules,
  productUpdateValidationRules,
} = require("../requests/productRequest");
const {
  upload,
  handleUploadError,
  validateImage,
} = require("../middlewares/multer");

// Create a new router instance.
const productRoutes = express.Router();

// Middleware to attach the productController to the request.
productRoutes.use((req, res, next) => {
  // Resolve productController from the DI container attached to the request.
  req.productController = req.container.resolve("productController");
  next();
});

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Endpoints for managing products
 */

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Store a new product.
 *     description: Stores a new product. Requires admin privileges
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product
 *                 example: Product Name
 *               category_id:
 *                 type: integer
 *                 description: The ID of the category the product belongs to
 *                 example: 1
 *               last_updated_restock_level:
 *                 type: integer
 *                 description: The last updated restock level of the product
 *                 example: 100
 *               current_stock_level:
 *                 type: integer
 *                 description: The current stock level of the product
 *                 example: 150
 *               add_stock:
 *                 type: boolean
 *                 description: Flag indicating if stock should be added along with the product
 *                 example: false
 *               cost_price:
 *                 type: number
 *                 format: float
 *                 description: The cost price of the product (required if add_stock is true)
 *                 example: 55.00
 *               retail_price:
 *                 type: number
 *                 format: float
 *                 description: The retail price of the product (required if add_stock is true)
 *                 example: 15.99
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product (required if add_stock is true)
 *                 example: 50
 *               comment:
 *                 type: string
 *                 description: Optional comment for the stock
 *                 example: Optional comment here
 *     responses:
 *       201:
 *         description: Product created
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
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     sku:
 *                       type: string
 *                     category_id:
 *                       type: integer
 *                     last_updated_restock_level:
 *                       type: integer
 *                       nullable: true
 *                     current_stock_level:
 *                       type: integer
 *                       nullable: true
 *                     stock:
 *                       type: object
 *                       nullable: true
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
 *             examples:
 *               WithoutStock:
 *                 summary: Product created without stock
 *                 value:
 *                   success: true
 *                   message: Product created
 *                   data:
 *                     id: 237d5e74-005f-44a5-a294-b6d541211939
 *                     name: Product Name
 *                     sku: SKU-202405161-0041
 *                     category_id: 1
 *                     last_updated_restock_level: null
 *                     current_stock_level: null
 *                     stock: null
 *               WithStock:
 *                 summary: Product created with associated stock
 *                 value:
 *                   success: true
 *                   message: Product with associated stock created
 *                   data:
 *                     id: dbe08f83-8d87-448d-8281-36858b890067
 *                     name: Product Name
 *                     sku: SKU-202405161-0042
 *                     category_id: 1
 *                     last_updated_restock_level: null
 *                     current_stock_level: null
 *                     stock:
 *                       cost_price: 55
 *                       retail_price: 15.99
 *                       id: 51
 *                       product_id: dbe08f83-8d87-448d-8281-36858b890067
 *                       quantity: 50
 *                       comment: Optional comment here
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
 */
productRoutes.post(
  "/",
  authenticate,
  isAdmin,
  productValidationRules(),
  validate,
  asyncHandler((req, res) => {
    return req.productController.storeProduct(req, res);
  })
);

/**
 * @swagger
 * /api/v1/products/{product_id}/get:
 *   get:
 *     summary: Retrieve a product by its ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to retrieve
 *     responses:
 *       200:
 *         description: Product retrieved successfully
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
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     sku:
 *                       type: string
 *                     category_id:
 *                       type: integer
 *                     last_updated_restock_level:
 *                       type: integer
 *                       nullable: true
 *                     current_stock_level:
 *                       type: integer
 *                       nullable: true
 *                     stock:
 *                       type: object
 *                       nullable: true
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
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               data:
 *                 id: "dbe08f83-8d87-448d-8281-36858b890067"
 *                 name: "Product Name"
 *                 sku: "SKU-202405161-0042"
 *                 category_id: 1
 *                 last_updated_restock_level: null
 *                 current_stock_level: null
 *                 stock:
 *                   cost_price: 55
 *                   retail_price: 15.99
 *                   id: 51
 *                   product_id: "dbe08f83-8d87-448d-8281-36858b890067"
 *                   quantity: 50
 *                   comment: "Optional comment here"
 *               message: "Product retrieved successfully"
 *       404:
 *         description: Product not found
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
 *               error: "Product not found"
 */

productRoutes.get(
  "/:product_id/get",
  authenticate,
  asyncHandler((req, res) => {
    const productId = req.params.product_id;

    return req.productController.getProduct(res, productId);
  })
);

/**
 * @swagger
 * /api/v1/products/{product_id}:
 *   delete:
 *     summary: Delete a product by its ID.
 *     description: This action requires admin privileges
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
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
 *               message: "Product deleted successfully"
 *       403:
 *         description: Forbidden. Admin authorization is required.
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
 *               error: "Admin authorization is required"
 *       404:
 *         description: Product not found
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
 *               error: "Product not found"
 */

productRoutes.delete(
  "/:product_id",
  authenticate,
  isAdmin,
  asyncHandler((req, res) => {
    const productId = req.params.product_id;

    return req.productController.deleteProduct(res, productId);
  })
);

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       sku:
 *                         type: string
 *                       category_id:
 *                         type: integer
 *                       last_updated_restock_level:
 *                         type: integer
 *                         nullable: true
 *                       current_stock_level:
 *                         type: integer
 *                         nullable: true
 *                       stock:
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
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               data:
 *                 - id: "04bc7a08-757a-4921-aece-bd3cc6fc72e0"
 *                   name: "Product 38"
 *                   sku: "SKU-202405163-0039"
 *                   category_id: 3
 *                   last_updated_restock_level: 39
 *                   current_stock_level: 83
 *                   stock:
 *                     cost_price: 20.28
 *                     retail_price: 20.24
 *                     id: 38
 *                     product_id: "04bc7a08-757a-4921-aece-bd3cc6fc72e0"
 *                     quantity: 73
 *                     comment: "Initial stock for Product 38"
 *               message: "Products retrieved successfully"
 *       401:
 *         description: Unauthorized. Authentication is required.
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
 *               error: "Authentication required"
 */

productRoutes.get(
  "/",
  authenticate,
  asyncHandler((req, res) => {
    return req.productController.getProducts(res);
  })
);

/**
 * @swagger
 * /api/v1/products/deleted:
 *   get:
 *     summary: Retrieve soft-deleted products
 *     description: Retrieves all soft deleted products. Requires admin privileges
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retrieved deleted products
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
 *                     deleted_products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           sku:
 *                             type: string
 *                           category_id:
 *                             type: integer
 *                           last_updated_restock_level:
 *                             type: integer
 *                             nullable: true
 *                           current_stock_level:
 *                             type: integer
 *                             nullable: true
 *                           deleted_at:
 *                             type: string
 *                             format: date-time
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                           updated_at:
 *                             type: string
 *                             format: date-time
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               data:
 *                 deleted_products:
 *                   - id: "04bc7a08-757a-4921-aece-bd3cc6fc72e0"
 *                     name: "Product Name 4"
 *                     sku: "SKU-202405163-0039"
 *                     category_id: 2
 *                     last_updated_restock_level: 39
 *                     current_stock_level: 83
 *                     deleted_at: "2024-05-16T20:17:53.000Z"
 *                     created_at: "2024-05-16T16:07:05.000Z"
 *                     updated_at: "2024-05-16T20:17:53.000Z"
 *               message: "Retrieved deleted products"
 *       403:
 *         description: Forbidden - Admin authorization required
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
 *               error: "Forbidden - Admin authorization required"
 *       401:
 *         description: Unauthorized - Authentication required
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
 *               error: "Unauthorized - Authentication required"
 */

productRoutes.get(
  "/deleted",
  authenticate,
  isAdmin,
  asyncHandler((req, res) => {
    return req.productController.getSoftDeletedProducts(res);
  })
);

/**
 * @swagger
 * /api/v1/products/{product_id}/force/delete:
 *   delete:
 *     summary: Force delete a product
 *     description: Permanently deletes a product. This action requires admin authorization.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to be deleted
 *     responses:
 *       200:
 *         description: Product deleted completely
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
 *               message: "Product deleted completely"
 *       404:
 *         description: Product not found
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
 *               error: "Product not found"
 *       403:
 *         description: Forbidden - Admin authorization required
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
 *               error: "Admin authorization required"
 */

productRoutes.delete(
  "/:product_id/force/delete",
  authenticate,
  isAdmin,
  asyncHandler((req, res) => {
    const productId = req.params.product_id;

    return req.productController.forceDeleteProduct(req, res, productId);
  })
);

/**
 * @swagger
 * /api/v1/products/{product_id}:
 *   put:
 *     summary: Update a product
 *     description: Updates a product. This action requires admin authorization.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               last_updated_restock_level:
 *                 type: integer
 *               current_stock_level:
 *                 type: integer
 *             example:
 *               name: "Product Name 4"
 *               category_id: 1
 *               last_updated_restock_level: 39
 *               current_stock_level: 83
 *     responses:
 *       200:
 *         description: Product updated successfully
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
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     sku:
 *                       type: string
 *                     category_id:
 *                       type: integer
 *                     last_updated_restock_level:
 *                       type: integer
 *                     current_stock_level:
 *                       type: integer
 *                     stock:
 *                       type: object
 *                       properties:
 *                         cost_price:
 *                           type: number
 *                           format: float
 *                         retail_price:
 *                           type: number
 *                           format: float
 *                         id:
 *                           type: integer
 *                         product_id:
 *                           type: string
 *                         quantity:
 *                           type: integer
 *                         comment:
 *                           type: string
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               data:
 *                 id: "04bc7a08-757a-4921-aece-bd3cc6fc72e0"
 *                 name: "Product Name 4"
 *                 sku: "SKU-202405163-0039"
 *                 category_id: 1
 *                 last_updated_restock_level: 39
 *                 current_stock_level: 83
 *                 stock:
 *                   cost_price: 20.28
 *                   retail_price: 20.24
 *                   id: 38
 *                   product_id: "04bc7a08-757a-4921-aece-bd3cc6fc72e0"
 *                   quantity: 73
 *                   comment: "Initial stock for Product 38"
 *               message: "Product updated successfully"
 *       404:
 *         description: Product not found
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
 *               error: "Product not found"
 */

productRoutes.put(
  "/:product_id",
  authenticate,
  isAdmin,
  productUpdateValidationRules(),
  validate,
  asyncHandler((req, res) => {
    const productId = req.params.product_id;

    return req.productController.updateProduct(req, res, productId);
  })
);

module.exports = productRoutes;
