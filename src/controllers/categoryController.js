const logger = require("../config/logging");
const CategoryResource = require("../resources/categoryResource");
class CategoryController {
  /**
   * CategoryController constructor.
   * Injects CategoryService for handling the business logic.
   * @param {CategoryService} categoryService - The service for category operations.
   */
  constructor({ categoryService }) {
    this.categoryService = categoryService;
  }

  /**
   * Handles the request to store category
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   */
  async storeCategory(req, res) {
    const category = await this.categoryService.storeCategory(req.body);
    const categoryResource = new CategoryResource(category);
    return res.created(
      { category: categoryResource.toJson() },
      "Category created"
    );
  }

  async updateCategory(req, res, categoryId) {
    const updatedCat = await this.categoryService.updateCategory(
      req.body,
      categoryId
    );

    const categoryResource = new CategoryResource(updatedCat);

    return res.success(
      { category: categoryResource.toJson() },
      "Category updated"
    );
  }

  async getCategories(res) {
    return res.success({
      categories: await this.categoryService.getCategories(),
    });
  }

  async getCategory(res, categoryId) {
    const category = await this.categoryService.getCategory(categoryId);

    res.success({ category: category });
  }

  async deleteCategory(res, categoryId) {
    return res.success(await this.categoryService.deleteCategory(categoryId));
  }
}

module.exports = CategoryController;
