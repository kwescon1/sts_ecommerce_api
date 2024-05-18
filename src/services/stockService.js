const { sequelize, Product, Stock } = require("../models");
const ConflictException = require("../exceptions/conflictException");
const { Op } = require("sequelize");
const NotFoundException = require("../exceptions/notFoundException");

/**
 * Represents the service for managing stocks.
 * Encapsulates the business logic for stock operations.
 */
class StockService {
  // from products service to this method
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

    const stock = await Stock.create(data, { transaction });

    // Update the product's current stock level
    const product = await Product.findOne({
      where: { id: data.product_id },
      transaction,
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    await product.update(
      {
        current_stock_level: data.quantity,
      },
      { transaction }
    );

    return stock;
  }

  async storeStock(data) {
    // Check for existing stock
    const existingStock = await Stock.findOne({
      where: { product_id: data.product_id },
    });

    if (existingStock) {
      throw new ConflictException(
        "Product already has stock. Consider an update instead."
      );
    }

    const stock = await Stock.create(data);

    // Update the product's current stock level
    const product = await Product.findOne({ where: { id: data.product_id } });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    await product.update({
      current_stock_level: data.quantity,
    });

    return stock;
  }

  // Adds stock to stock already in stock table
  async updateProductStock(productId, data) {
    const stock = await Stock.findOne({ where: { product_id: productId } });

    if (!stock) {
      throw new NotFoundException("Product stock not found");
    }

    return await sequelize.transaction(async (transaction) => {
      // Check if quantity is in the incoming data
      if (data.hasOwnProperty("quantity")) {
        const currentQuantity = stock.quantity;
        const newQuantity = currentQuantity + data.quantity;

        // Update the stock quantity in data
        data.quantity = newQuantity;

        // Find the associated product
        const product = await Product.findOne({
          where: { id: productId },
          transaction,
        });

        if (!product) {
          throw new NotFoundException("Product not found");
        }

        // Update the product's stock levels
        await product.update(
          {
            current_stock_level: newQuantity,
            last_updated_restock_level: currentQuantity,
          },
          { transaction }
        );
      }

      // Update the stock with the incoming data
      await stock.update(data, { transaction });

      // Reload the stock to include the associated product
      return stock.reload({
        include: "product",
        transaction,
      });
    });
  }

  async getProductStock(productId) {
    const stock = await Stock.findOne({
      where: { product_id: productId },
      include: "product",
    });

    if (!stock) {
      throw new NotFoundException("Product stock not found");
    }

    return stock;
  }

  //   TODO paginate later on
  async getStocks() {
    const stocks = await Stock.findAll({
      include: "product",
    });

    return stocks;
  }

  //   TODO paginate later on
  async getSoftDeletedProductsStock() {
    const deletedStocks = await Stock.scope("withDeletedAt").findAll({
      where: { deleted_at: { [Op.not]: null } },
      include: "product",
      paranoid: false,
    });

    return deletedStocks;
  }

  async deleteProductStock(productId) {
    // Find the stock associated with the product
    const stock = await Stock.findOne({ where: { product_id: productId } });

    if (!stock) {
      throw new NotFoundException("Product stock not found");
    }

    return await sequelize.transaction(async (transaction) => {
      // Find the associated product
      const product = await Product.findOne({
        where: { id: productId },
        transaction,
      });

      if (!product) {
        throw new NotFoundException("Product not found");
      }

      // Update the product's current stock level to 0
      await product.update(
        {
          current_stock_level: 0,
        },
        { transaction }
      );

      // Delete the stock entry
      await stock.destroy({ transaction });

      return true;
    });
  }

  async forceDeleteProductStock(productId) {
    const stock = await Stock.findOne({
      where: { product_id: productId },
      paranoid: false,
    });

    if (!stock) {
      throw new NotFoundException("Product stock not found");
    }

    await stock.destroy({ force: true });

    return true;
  }
}

module.exports = StockService;
