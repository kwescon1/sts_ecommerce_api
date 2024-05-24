"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderItem.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
        constraints: false,
      });
      OrderItem.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "order",
        constraints: false,
      });
    }
  }
  OrderItem.init(
    {
      order_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price_at_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        get() {
          const rawValue = this.getDataValue("price_at_order");
          return rawValue / 100;
        },
        set(value) {
          this.setDataValue("price_at_order", Math.round(value * 100));
        },
      },
    },
    {
      sequelize,
      modelName: "OrderItem",
      tableName: "order_items",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true, // Enables soft deletion
      deletedAt: "deleted_at",
    }
  );
  return OrderItem;
};
