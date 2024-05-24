"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        constraints: false,
      });
      Order.hasMany(models.OrderItem, {
        foreignKey: "order_id",
        as: "items",
        onDelete: "CASCADE",
      });
      Order.hasMany(models.Transaction, {
        foreignKey: "order_id",
        as: "transactions",
        onDelete: "CASCADE",
      });

      Order.hasMany(models.ShippingAddress, {
        foreignKey: "order_id",
        as: "order",
        onDelete: "CASCADE",
      });
    }
  }
  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      total_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        get() {
          const rawValue = this.getDataValue("total_price");
          return rawValue / 100;
        },
        set(value) {
          this.setDataValue("total_price", Math.round(value * 100));
        },
      },
      order_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        allowNull: false,
        defaultValue: "pending",
      },
      order_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
    }
  );
  return Order;
};
