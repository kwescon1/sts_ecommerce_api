"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    static associate(models) {
      Stock.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
    }
  }
  Stock.init(
    {
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      cost_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        get() {
          return this.getDataValue("cost_price") / 100;
        },
        set(value) {
          this.setDataValue("cost_price", Math.round(value * 100));
        },
      },
      retail_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        get() {
          return this.getDataValue("retail_price") / 100;
        },
        set(value) {
          this.setDataValue("retail_price", Math.round(value * 100));
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Stock",
      tableName: "stocks",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true, // Enable soft delete
      deletedAt: "deleted_at",
      defaultScope: {
        attributes: {
          exclude: ["created_at", "updated_at", "deleted_at"],
        },
      },
    }
  );

  return Stock;
};
