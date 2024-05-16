const { body, param } = require("express-validator");
const { User, Product } = require("../models");
const ValidationException = require("../exceptions/validationException");

const addToWishlistValidationRules = () => [
  body("user_id")
    .notEmpty()
    .withMessage("User ID is required")
    .isUUID()
    .withMessage("User ID must be a valid UUID")
    .custom(async (value) => {
      const user = await User.findByPk(value);
      if (!user) {
        throw new ValidationException("User not found");
      }
      return true;
    }),

  body("product_id")
    .notEmpty()
    .withMessage("Product ID is required")
    .isUUID()
    .withMessage("Product ID must be a valid UUID")
    .custom(async (value) => {
      const product = await Product.findByPk(value);
      if (!product) {
        throw new ValidationException("Product not found");
      }
      return true;
    }),
];

const removeFromWishlistValidationRules = () => [
  param("user_id")
    .notEmpty()
    .withMessage("User ID is required")
    .isUUID()
    .withMessage("User ID must be a valid UUID")
    .custom(async (value) => {
      const user = await User.findByPk(value);
      if (!user) {
        throw new ValidationException("User not found");
      }
      return true;
    }),

  param("product_id")
    .notEmpty()
    .withMessage("Product ID is required")
    .isUUID()
    .withMessage("Product ID must be a valid UUID")
    .custom(async (value) => {
      const product = await Product.findByPk(value);
      if (!product) {
        throw new ValidationException("Product not found");
      }
      return true;
    }),
];

module.exports = {
  addToWishlistValidationRules,
  removeFromWishlistValidationRules,
};
