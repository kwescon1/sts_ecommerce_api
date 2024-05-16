const { Stock } = require("../models");
const ConflictException = require("../exceptions/conflictException");

/**
 * Represents the service for managing stocks.
 * Encapsulates the business logic for stock operations.
 */
class StockService {
  async storeProductStock(data, transaction) {
    const existingStock = await Stock.findOne({
      where: { product_id: data.product_id },
      transaction,
    });

    if (existingStock) {
      throw new ConflictException(
        "Product already has a stock record. Consider updating the stock instead."
      );
    }

    return await Stock.create(data, { transaction });
  }
}

module.exports = StockService;
