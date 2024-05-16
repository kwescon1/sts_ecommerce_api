"use strict";

const { v4: uuidv4 } = require("uuid");
const { generate } = require("../utilities/skuGenerator");
const redisService = require("../services/redisService");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    function getRandomElement(arr) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex]["id"];
    }

    const categories = [];
    const products = [];
    const stocks = [];

    for (let i = 1; i <= 5; i++) {
      categories.push({
        id: i,
        name: `Category_${i}`,
        description: `This is the description for category ${i}`,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    for (let i = 1; i <= 50; i++) {
      const id = uuidv4();
      const category_id = getRandomElement(categories);

      // Get the latest SKU number from Redis or initialize it
      const latestSkuNumber =
        (await redisService.get("latest_sku")) || i.toString().padStart(4, "0");
      const sku = generate(category_id, latestSkuNumber);

      console.log(sku.split("-")[2]);

      // Update the latest SKU number in Redis
      await redisService.set(
        "latest_sku",
        sku.split("-")[2], // Extract the unique SKU number
        60 * 60 // Cache for 1 hour
      );

      products.push({
        id,
        name: `Product ${i}`,
        category_id,
        sku,
        last_updated_restock_level: Math.floor(Math.random() * 100),
        current_stock_level: Math.floor(Math.random() * 100),
        created_at: new Date(),
        updated_at: new Date(),
      });

      stocks.push({
        product_id: id,
        cost_price: Math.floor(Math.random() * 5000),
        retail_price: Math.floor(Math.random() * 10000),
        quantity: Math.floor(Math.random() * 100),
        comment: `Initial stock for Product ${i}`,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("categories", categories, {});
    await queryInterface.bulkInsert("products", products, {});
    await queryInterface.bulkInsert("stocks", stocks, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("stocks", null, {});
    await queryInterface.bulkDelete("products", null, {});
    // await queryInterface.bulkDelete("categories", null, {});
  },
};
