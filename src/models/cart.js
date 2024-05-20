"use strict";
const { Model, Op } = require("sequelize");
const CART_CACHE_KEY = "CART-";

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static CART_CACHE_KEY = CART_CACHE_KEY;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cart.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      Cart.hasMany(models.CartItem, {
        foreignKey: "cart_id",
        as: "items",
        onDelete: "CASCADE",
      });
    }
  }
  Cart.init(
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
      is_current: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "Cart",
      tableName: "carts",
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
        withPartialDates: {
          attributes: { include: ["created_at", "updated_at"] },
        },
        isDeleted: {
          where: {
            deleted_at: { [Op.not]: null },
          },
        },
      },
    }
  );
  return Cart;
};
