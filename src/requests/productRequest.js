const { body, param } = require("express-validator");
const ValidationException = require("../exceptions/validationException");

const productValidationRules = () => [
  body("name")
    .notEmpty()
    .withMessage("Product name is required")
    .isString()
    .withMessage("Product name must be a string"),

  body("category_id")
    .notEmpty()
    .withMessage("Category ID is required")
    .isInt()
    .withMessage("Category ID must be an integer"),
  body("last_updated_restock_level")
    .optional()
    .isInt()
    .withMessage("Last updated restock level must be an integer"),
  body("current_stock_level")
    .optional()
    .isInt()
    .withMessage("Current stock level must be an integer"),
  body("add_stock")
    .optional()
    .isBoolean()
    .withMessage("Add stock must be a boolean"),
  body("cost_price").custom((value, { req }) => {
    if (req.body.add_stock && req.body.add_stock === true) {
      if (value === undefined) {
        throw new ValidationException(
          "Cost price is required if add_stock is true"
        );
      }
      if (typeof value !== "number" || value <= 0) {
        throw new ValidationException("Cost price must be a positive number");
      }
    }
    return true;
  }),
  body("retail_price").custom((value, { req }) => {
    if (req.body.add_stock && req.body.add_stock === true) {
      if (value === undefined) {
        throw new ValidationException(
          "Retail price is required if add_stock is true"
        );
      }
      if (typeof value !== "number" || value <= 0) {
        throw new ValidationException("Retail price must be a positive number");
      }
    }
    return true;
  }),
  body("quantity").custom((value, { req }) => {
    if (req.body.add_stock && req.body.add_stock === true) {
      if (value === undefined) {
        throw new ValidationException(
          "Quantity is required if add_stock is true"
        );
      }
      if (!Number.isInteger(value) || value <= 0) {
        throw new ValidationException("Quantity must be a positive integer");
      }
    }
    return true;
  }),
  body("comment")
    .optional()
    .isString()
    .withMessage("Comment must be a string")
    .custom((value, { req }) => {
      if (
        req.body.add_stock &&
        req.body.add_stock === true &&
        value !== undefined &&
        typeof value !== "string"
      ) {
        throw new Error("Comment must be a string if provided");
      }
      return true;
    }),
];

const productUpdateValidationRules = () => [
  param("product_id").isUUID().withMessage("Invalid product ID"),
  body("name")
    .optional()
    .isString()
    .withMessage("Product name must be a string"),
  body("category_id")
    .optional()
    .isInt()
    .withMessage("Category ID must be an integer"),
];

module.exports = {
  productValidationRules,
  productUpdateValidationRules,
};
