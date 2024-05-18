const logger = require("../config/logging");

class StockController {
  /**
   * StockController constructor.
   * Injects StockService for handling the business logic.
   * @param {stockService} stockService - The service for user stock operations.
   */
  constructor({ stockService }) {
    this.stockService = stockService;
  }

  async storeProductStock(req, res) {
    const data = req.body;

    const stock = await this.stockService.storeStock(data);

    return res.created(stock, "Product stock created");
  }

  async updateProductStock(req, res, productId) {
    const updateData = req.body;

    const updatedStock = await this.stockService.updateProductStock(
      productId,
      updateData
    );

    return res.success(
      { stock: updatedStock },
      "Product stock updated successfully"
    );
  }

  async getProductStock(res, productId) {
    const stock = await this.stockService.getProductStock(productId);

    return res.success(stock, "Product stock retrieved successfully");
  }

  async getStocks(res) {
    const stocks = await this.stockService.getStocks();

    return res.success(stocks, "Products stock retrieved successfully");
  }

  async deleteProductStock(res, productId) {
    const stock = await this.stockService.deleteProductStock(productId);

    return res.success(stock, "Product stock deleted successfully");
  }

  async getSoftDeletedProductsStock(res) {
    const deletedStocks = await this.stockService.getSoftDeletedProductsStock();

    return res.success(
      { deleted_stocks: deletedStocks },
      "Retrieved deleted products stock"
    );
  }

  async forceDeleteProductStock(res, productId) {
    const stock = await this.stockService.forceDeleteProductStock(productId);

    return res.success(stock, "Product stock deleted completely");
  }
}

module.exports = StockController;
