const { body, param } = require("express-validator");
const { User, Product, Cart } = require("../models");
const ValidationException = require("../exceptions/validationException");

const storeCartValidationRules = () => [
  body("product_id")
    .notEmpty()
    .withMessage("Product ID is required")
    .isUUID()
    .withMessage("Product ID must be a valid UUID"),
];

const updateCartValidationRules = () => [
  param("cart_id")
    .notEmpty()
    .withMessage("Cart ID is required")
    .bail()
    .isUUID()
    .withMessage("Cart ID must be a valid UUID")
    .bail()
    .custom(async (value) => {
      const cart = await Cart.findByPk(value);
      if (!cart) {
        throw new ValidationException("Cart not found");
      }
      return true;
    }),
  body("product_id")
    .notEmpty()
    .withMessage("Product ID is required")
    .isUUID()
    .withMessage("Product ID must be a valid UUID")
    .bail()
    .custom(async (value) => {
      const product = await Product.findByPk(value);
      if (!product) {
        throw new ValidationException("Product not found");
      }
      return true;
    }),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
];

module.exports = {
  storeCartValidationRules,
  updateCartValidationRules,
};
