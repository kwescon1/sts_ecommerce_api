const { body } = require("express-validator");
const ValidationException = require("../exceptions/validationException");
const { User } = require("../models");

const addressValidationRules = () => [
  body("street_address").notEmpty().withMessage("Street address is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("postal_code").notEmpty().withMessage("Postal code is required"),
  body("country")
    .notEmpty()
    .withMessage("Country is required")
    .isString()
    .withMessage("Country must be a string"),
  body("label").optional().isString().withMessage("Label must be a string"),
  body("state").optional().isString().withMessage("State must be a string"),
];

const updateProfileValidationRules = () => [
  body("first_name")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name (first_name) must not be empty.")
    .isString()
    .withMessage("First name (first_name) must be a string."),

  body("last_name")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Last name (last_name) must not be empty.")
    .isString()
    .withMessage("Last name (last_name) must be a string."),

  body("username")
    .optional()
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage(
      "Username (username) must be between 5 and 20 characters long."
    )
    .isAlphanumeric()
    .withMessage("Username (username) must be alphanumeric.")
    // Custom validation to check if the username already exists and does not belong to the user making the update
    .custom(async (value, { req }) => {
      const existingUser = await User.findOne({ where: { username: value } });
      if (existingUser) {
        if (existingUser.id !== req.user.id) {
          throw new ValidationException("Username already exists");
        }
      }
      return true;
    }),

  body("email")
    .optional()
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email (email) address.")
    .isLength({ max: 254 })
    .withMessage(
      "Email (email) address must not be longer than 254 characters."
    ),
];

module.exports = {
  addressValidationRules,
  updateProfileValidationRules,
};
