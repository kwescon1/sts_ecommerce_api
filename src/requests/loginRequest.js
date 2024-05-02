const { body } = require("express-validator");

const loginValidationRules = () => [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username (username) is required."),

  body("password").notEmpty().withMessage("Password (password)is required."),
];

module.exports = {
  loginValidationRules,
};
