const { body } = require("express-validator");

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

module.exports = {
  addressValidationRules,
};
