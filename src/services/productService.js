const { sequelize, Product, Stock } = require("../models");
const { Op } = require("sequelize");
const { extractProductData, extractStockData } = require("../utilities/utils");
const {
  generate,
  extractUniqueSkuNumber,
} = require("../utilities/skuGenerator");
const NotFoundException = require("../exceptions/notFoundException");
const ConflictException = require("../exceptions/conflictException");
const stock = require("../models/stock");

/**
 * Represents the service for managing products.
 * Encapsulates the business logic for product operations.
 */
class ProductService {
  constructor({ stockService, redisService }) {
    this.stockService = stockService;
    this.redisService = redisService;
    this.CACHE_KEY_UNIQUE_SKU_NUMBER = "latest_sku";
    this.CACHE_SECONDS = 60 * 60; // Cache for 1 hour
  }

  async storeProduct(data) {
    const body = extractProductData(data);

    // Generate SKU
    body.sku = await this.generateSku(body.category_id);

    console.log(`Generated SKU is: ${body.sku}`);

    const stockBody = extractStockData(data);

    return await sequelize.transaction(async (transaction) => {
      const product = await Product.create(body, { transaction });

      if (data.add_stock) {
        stockBody.product_id = product.id;

        await this.stockService.storeProductStock(stockBody, transaction);
      }

      return product.reload({
        include: [{ model: Stock, as: "stock" }],
        transaction,
      });
    });
  }

  async updateProduct(productId, data) {
    const product = await Product.findByPk(productId);

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    const body = extractProductData(data);

    await product.update(body);

    return product.reload({
      include: "stock",
    });
  }

  async getProduct(productId) {
    const product = await Product.findByPk(productId, { include: "stock" });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  //   TODO paginate later on
  async getProducts() {
    const products = await Product.findAll({
      include: "stock",
    });

    return products;
  }

  //   TODO paginate later on
  async getSoftDeletedProducts() {
    const deletedProducts = await Product.scope("withDeletedAt").findAll({
      where: { deleted_at: { [Op.not]: null } },
      paranoid: false,
    });

    return deletedProducts;
  }

  async deleteProduct(productId) {
    const product = await Product.findByPk(productId);

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return await sequelize.transaction(async (transaction) => {
      // Soft delete the product
      await product.destroy({ transaction });

      // Check if stock exists before attempting to update it
      const stock = await Stock.findOne({
        where: { product_id: productId },
        transaction,
        paranoid: false,
      });

      if (stock) {
        // Soft delete the associated stock records
        await stock.update({ deleted_at: new Date() }, { transaction });
      }

      return true;
    });
  }

  async forceDeleteProduct(productId) {
    const product = await Product.findByPk(productId, {
      paranoid: false,
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    await product.destroy({ force: true });

    return true;
  }

  async generateSku(itemCategory) {
    // Check Redis for the latest SKU
    let latestUniqueSkuNumber = await this.latestUniqueSkuNumber();
    console.log(
      "Latest unique SKU number from Redis or DB:",
      latestUniqueSkuNumber
    );

    // Generate the next SKU
    let productSku = generate(itemCategory, latestUniqueSkuNumber);

    // Ensure the SKU is unique
    while (await this.verifyProductNumber(productSku)) {
      console.log(
        "SKU already exists, resetting cached unique SKU number:",
        productSku
      );
      await this.resetCachedUniqueSkuNumber(productSku);
      productSku = generate(itemCategory, latestUniqueSkuNumber);
    }

    // Store the latest SKU number in Redis
    await this.redisService.set(
      this.CACHE_KEY_UNIQUE_SKU_NUMBER,
      extractUniqueSkuNumber(productSku),
      this.CACHE_SECONDS
    );

    console.log("Final generated SKU:", productSku);
    return productSku;
  }

  async verifyProductNumber(sku) {
    console.log("Verifying if SKU exists:", sku);
    return await Product.findOne({
      paranoid: false,
      where: { sku },
    });
  }

  async latestUniqueSkuNumber() {
    // Try to get the latest SKU number from Redis
    let latestUniqueSkuNumber = await this.redisService.get(
      this.CACHE_KEY_UNIQUE_SKU_NUMBER
    );
    console.log("Latest unique SKU number from Redis:", latestUniqueSkuNumber);

    if (!latestUniqueSkuNumber) {
      // If not in cache, get it from the database
      const lastSavedProduct = await this.lastSavedProduct();
      latestUniqueSkuNumber = lastSavedProduct
        ? extractUniqueSkuNumber(lastSavedProduct.sku)
        : "0000"; // Default value if no products are found

      console.log("Latest unique SKU number from DB:", latestUniqueSkuNumber);

      // Save the latest SKU number to Redis
      await this.redisService.set(
        this.CACHE_KEY_UNIQUE_SKU_NUMBER,
        latestUniqueSkuNumber,
        this.CACHE_SECONDS
      );
    }

    return latestUniqueSkuNumber;
  }

  async lastSavedProduct() {
    // Find the latest product including soft-deleted ones
    console.log("Finding the last saved product.");
    return await Product.findOne({
      paranoid: false,
      order: [["created_at", "DESC"]],
    });
  }

  async resetCachedUniqueSkuNumber(sku) {
    console.log("Resetting cached unique SKU number to:", sku);
    await this.redisService.set(
      this.CACHE_KEY_UNIQUE_SKU_NUMBER,
      extractUniqueSkuNumber(sku),
      this.CACHE_SECONDS
    );
  }
}

module.exports = ProductService;
