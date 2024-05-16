const logger = require("../config/logging");

class ProductController {
  /**
   * ProductController constructor.
   * Injects ProductService for handling the business logic.
   * @param {productService} productService - The service for user product operations.
   */
  constructor({ productService }) {
    this.productService = productService;
  }

  async storeProduct(req, res) {
    const data = req.body;

    const product = await this.productService.storeProduct(data);

    if (data.add_stock)
      return res.created(product, "Product with associated stock created");

    return res.created(product, "Product created");
  }

  async updateProduct(req, res, productId) {
    const updateData = req.body;

    const updatedProduct = await this.productService.updateProduct(
      productId,
      updateData
    );

    return res.success(
      { data: updatedProduct },
      "Product updated successfully"
    );
  }

  async getProduct(res, productId) {
    const product = await this.productService.getProduct(productId);

    return res.success(product, "Product retrieved successfully");
  }

  async getProducts(res) {
    const products = await this.productService.getProducts();

    return res.success(products, "Products retrieved successfully");
  }

  async deleteProduct(res, productId) {
    const product = await this.productService.deleteProduct(productId);

    return res.success(product, "Product deleted successfully");
  }

  async getSoftDeletedProducts(res) {
    const deletedProducts = await this.productService.getSoftDeletedProducts();

    return res.success(
      { deleted_products: deletedProducts },
      "Retrieved deleted products"
    );
  }

  async forceDeleteProduct(res, productId) {
    const product = await this.productService.forceDeleteProduct(productId);

    return res.success(product, "Product deleted completely");
  }
}

module.exports = ProductController;
