/**
 * @class CategoryResource
 */
class CategoryResource {
  /**
   * Constructs an instance of CategoryResource with a category object.
   *
   * @param {Object} category - The category object containing data to be transformed.
   */
  constructor(category) {
    this.category = category;
  }

  /**
   * Transforms the category object into a JSON-friendly format
   * @returns {Object}
   */
  toJson() {
    return {
      id: this.category.id,
      name: this.category.name,
      description: this.category.description,
    };
  }
}

module.exports = CategoryResource;
