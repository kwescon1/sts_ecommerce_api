const { body } = require("express-validator");
const moment = require("moment");
const ValidationException = require("../exceptions/validationException");

const userValidationRules = () => [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name (first_name) is required.")
    .isString()
    .withMessage("First name (first_name) must be a string."),

  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Last name (last_name) is required.")
    .isString()
    .withMessage("Last name (last_name) must be a string."),

  body("dob")
    .trim()
    .notEmpty()
    .withMessage("Date of birth (dob) is required.")
    .bail()
    .isDate({ format: "YYYY-MM-DD" })
    .withMessage(
      "Date of birth (dob) must be a valid date in the format YYYY-MM-DD."
    )
    .bail()
    .custom((value) => {
      const dob = moment(value);
      const eighteenYearsAgo = moment().subtract(18, "years");

      if (dob.isAfter(eighteenYearsAgo)) {
        throw new ValidationException(
          "User must be at least 18 years old to register."
        );
      }

      return true;
    }),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username (username) is required.")
    .isAlphanumeric()
    .withMessage("Username (username) must be alphanumeric.")
    .isLength({ min: 5, max: 20 })
    .withMessage(
      "Username (username) must be between 5 and 20 characters long."
    ),

  body("password")
    .notEmpty()
    .withMessage("Password (password)is required.")
    .isLength({ min: 8 })
    .withMessage("Password (password) minimum length is 8.")
    .matches(/\d/)
    .withMessage("Password (password) must contain at least one number.")
    .matches(/[a-z]/)
    .withMessage(
      "Password (password) must contain at least one lowercase letter."
    )
    .matches(/[A-Z]/)
    .withMessage(
      "Password (password) must contain at least one uppercase letter."
    )
    .matches(/[\!\@\#\$\%\^\&\*\(\)\_\+\!]/)
    .withMessage(
      "Password (password) must contain at least one special character."
    )
    .not()
    .contains(" ")
    .withMessage("Password (password) must not contain spaces."),

  body("password_confirmation")
    .notEmpty()
    .withMessage("Password confirmation (password_confirmation) is required.")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        throw new ValidationException(
          "Password (password) must match password confirmation (password_confirmation)"
        );
      }
      return true;
    }),

  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email (email) address.")
    .isLength({ max: 254 })
    .withMessage(
      "Email (email) address must not be longer than 254 characters."
    )
    // .custom((email) => {
    //   const domain = email.split("@")[1];
    //   if (domain !== "example.com") {
    //     throw new ValidationException(
    //       "Email (email) must be from the domain example.com"
    //     );
    //   }
    //   return true;
    // })
    .not()
    .isIn(["/", "\\", "<", ">", "&"])
    .withMessage("Email (email) address contains invalid characters."),
];

module.exports = {
  userValidationRules,
};
