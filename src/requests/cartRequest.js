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

const processCartValidationRules = () => [
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
  // Add validation for billing_is_shipping and shipping address
  body("billing_is_shipping")
    .isBoolean()
    .withMessage("Billing is shipping is required and must be a boolean value"),
  body("street_address")
    .if(body("billing_is_shipping").equals(false))
    .notEmpty()
    .withMessage("Street address is required")
    .isString()
    .withMessage("Street address must be a string"),
  body("city")
    .if(body("billing_is_shipping").equals(false))
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string"),
  body("state")
    .if(body("billing_is_shipping").equals(false))
    .optional()
    .isString()
    .withMessage("State must be a string"),
  body("postal_code")
    .if(body("billing_is_shipping").equals(false))
    .notEmpty()
    .withMessage("Postal code is required")
    .isString()
    .withMessage("Postal code must be a string"),
  body("country")
    .if(body("billing_is_shipping").equals(false))
    .notEmpty()
    .withMessage("Country is required")
    .isString()
    .withMessage("Country must be a string"),
];

module.exports = {
  storeCartValidationRules,
  updateCartValidationRules,
  processCartValidationRules,
};
