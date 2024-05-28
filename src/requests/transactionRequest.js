const { body } = require("express-validator");

const verifyTransaction = () => [
  body("payment_id")
    .notEmpty()
    .withMessage("Payment ID is required")
    .isString()
    .withMessage("Product ID must be a valid string"),
];

module.exports = {
  verifyTransaction,
};
