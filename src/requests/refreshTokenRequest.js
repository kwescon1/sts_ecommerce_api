const { body } = require("express-validator");

const tokenValidationRules = () => [
  body("refresh_token")
    .trim()
    .notEmpty()
    .withMessage("Refresh Token (refresh_token) required"),
];

module.exports = {
  tokenValidationRules,
};
