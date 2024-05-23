"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("transactions", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      transaction_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        get() {
          const rawValue = this.getDataValue("amount");
          return rawValue / 100;
        },
        set(value) {
          this.setDataValue("amount", Math.round(value * 100));
        },
      },
      total: {
        type: Sequelize.INTEGER,
        allowNull: false,
        get() {
          const rawValue = this.getDataValue("total");
          return rawValue / 100;
        },
        set(value) {
          this.setDataValue("total", Math.round(value * 100));
        },
      },
      charge: {
        type: Sequelize.INTEGER,
        allowNull: false,
        get() {
          const rawValue = this.getDataValue("charge");
          return rawValue / 100;
        },
        set(value) {
          this.setDataValue("charge", Math.round(value * 100));
        },
      },
      status: {
        type: Sequelize.ENUM("pending", "completed", "failed", "refunded"),
        allowNull: false,
        defaultValue: "pending",
      },
      transaction_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("transactions", ["user_id"]);
    await queryInterface.addIndex("transactions", ["order_id"]);
    await queryInterface.addIndex("transactions", ["transaction_number"], {
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("transactions");
  },
};
