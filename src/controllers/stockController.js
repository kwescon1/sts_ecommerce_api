const logger = require("../config/logging");

class StockController {
  /**
   * StockController constructor.
   * Injects stockService for handling the business logic.
   * @param {stockService} stockService - The service for user product operations.
   */
  constructor({ stockService }) {
    this.stockService = stockService;
  }

  async storeProductStock(req, res) {}
}

module.exports = StockController;
