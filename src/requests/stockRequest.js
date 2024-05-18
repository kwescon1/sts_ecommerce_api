const { body, param } = require("express-validator");

const stockValidationRules = () => [
  body("product_id")
    .notEmpty()
    .withMessage("Product ID is required")
    .isUUID()
    .withMessage("Product ID must be a valid UUID"),
  body("cost_price")
    .notEmpty()
    .withMessage("Cost price is required")
    .isFloat({ gt: 0 })
    .withMessage("Cost price must be a positive number"),
  body("retail_price")
    .notEmpty()
    .withMessage("Retail price is required")
    .isFloat({ gt: 0 })
    .withMessage("Retail price must be a positive number"),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be a positive integer"),
  body("comment").optional().isString().withMessage("Comment must be a string"),
];

const stockUpdateValidationRules = () => [
  param("product_id").isUUID().withMessage("Invalid product ID"),
  body("cost_price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Cost price must be a positive number"),
  body("retail_price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Retail price must be a positive number"),
  body("quantity")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Quantity must be a positive integer"),
  body("comment").optional().isString().withMessage("Comment must be a string"),
];

module.exports = {
  stockValidationRules,
  stockUpdateValidationRules,
};
