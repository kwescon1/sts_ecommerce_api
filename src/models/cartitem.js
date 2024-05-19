"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CartItem.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
      CartItem.belongsTo(models.Cart, {
        foreignKey: "cart_id",
        as: "cart",
      });
    }
  }
  CartItem.init(
    {
      cart_id: {
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
        defaultValue: 1,
      },
      is_ordered: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      price: {
        type: DataTypes.VIRTUAL,
        get() {
          const quantity = this.getDataValue("quantity");
          const cost_price =
            this.product && this.product.stock
              ? this.product.stock.cost_price
              : 0;
          return quantity * cost_price;
        },
      },
    },
    {
      sequelize,
      modelName: "CartItem",
      tableName: "cart_items",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
      defaultScope: {
        attributes: {
          exclude: ["created_at", "updated_at", "deleted_at"],
        },
      },
      scopes: {
        withDates: {
          attributes: { include: ["created_at", "updated_at", "deleted_at"] },
        },
        isDeleted: {
          where: {
            deleted_at: { [Op.not]: null },
          },
        },
      },
    }
  );
  return CartItem;
};
