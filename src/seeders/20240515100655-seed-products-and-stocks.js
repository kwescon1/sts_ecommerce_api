"use strict";

const { v4: uuidv4 } = require("uuid");

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
      products.push({
        id,
        name: `Product ${i}`,
        category_id: getRandomElement(categories),
        sku: `SKU${i.toString().padStart(4, "0")}`,
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
