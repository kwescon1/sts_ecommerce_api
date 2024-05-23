"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    static associate(models) {
      // Define association with User
      Wishlist.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        constraints: false,
      });
      // Define association with Product
      Wishlist.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
        constraints: false,
      });
    }
  }

  Wishlist.init(
    {
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Wishlist",
      tableName: "wishlists",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      defaultScope: {
        attributes: {
          exclude: ["created_at", "updated_at"],
        },
      },
    }
  );
  return Wishlist;
};
