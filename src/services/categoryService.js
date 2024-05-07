const logger = require("../config/logging");
const ForbiddenException = require("../exceptions/forbiddenException");
const ValidationException = require("../exceptions/validationException");
const { Category, Product } = require("../models");
const { Op } = require("sequelize");

/**
 * Represents the service for managing categories.
 * Encapsulates the business logic for auth operations.
 */
class CategoryService {
  /**
   * Stores category
   * @param {Object} data - The data for stored category.
   * @returns {Promise<Object>} A promise that resolves to the stored category.
   */
  async storeCategory(data) {
    const categoryExists = await this.categoryExists(data?.name);

    if (categoryExists) {
      throw new ValidationException(`Category ${data?.name} exists`);
    }

    const category = await Category.create(data);

    return category;
  }

  /**
   * updates specified category
   * @param {Object} data - The data for updated category.
   * @returns {Promise<Object>} A promise that resolves to the updated category.
   */
  async updateCategory(data, categoryId) {
    // Check if a category with the same name exists other than the current category being updated
    const existingCategory = await Category.findOne({
      where: {
        name: data?.name,
        id: { [Op.not]: categoryId }, // Exclude the current category being updated
      },
    });

    if (existingCategory) {
      throw new ValidationException(`Category with name  already exists`);
    }

    // Update the category with the new data
    await Category.update(data, {
      where: { id: categoryId },
    });

    // Fetch and return the updated category
    const updatedCategory = await this.category(categoryId);

    return updatedCategory;
  }

  /**
   * @ return Promise<Array<Category>>
   */
  async getCategories() {
    return await Category.findAll();
  }

  async getCategory(categoryId) {
    return await Category.findByPk(categoryId);
  }

  async deleteCategory(categoryId) {
    // Check if the category has associated products
    const category = await Category.findByPk(categoryId, {
      include: [{ model: Product, as: "products" }],
    });

    if (category.products.length > 0) {
      throw new ForbiddenException(
        "Category cannot be deleted as it has associated products"
      );
    }

    // If no associated products, proceed with deletion
    await Category.destroy({ where: { id: categoryId } });

    return true;
  }

  async categoryExists(categoryName) {
    const existingCategory = await Category.findOne({
      where: { name: categoryName },
    });
    return !!existingCategory; // Return true if category exists, false otherwise
  }

  async category(categoryId) {
    const category = await Category.findByPk(categoryId);
    return category;
  }
}

module.exports = CategoryService;
