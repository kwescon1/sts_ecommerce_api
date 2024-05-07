const { body } = require("express-validator");
const { Category } = require("../models");
const ValidationException = require("../exceptions/validationException");

const storeCategoryValidationRules = () => [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ max: 255 })
    .withMessage("Name must not exceed 255 characters")
    .bail()
    .custom(async (value) => {
      const existingCategory = await Category.findOne({
        where: { name: value },
      });
      if (existingCategory) {
        throw new ValidationException(`Category ${value} already exists`);
      }
      return true;
    }),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];

const updateCategoryValidationRules = () => [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isLength({ max: 255 })
    .withMessage("Name must not exceed 255 characters")
    .bail()
    .custom(async (value, { req }) => {
      const existingCategory = await Category.findOne({
        where: { name: value },
      });
      if (existingCategory && existingCategory.id !== req.params.id) {
        throw new ValidationException(
          `Category ${existingCategory.name} already exists`
        );
      }
      return true;
    }),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];

module.exports = {
  storeCategoryValidationRules,
  updateCategoryValidationRules,
};
