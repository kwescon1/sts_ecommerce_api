"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasOne(models.Stock, {
        foreignKey: "product_id",
        onDelete: "CASCADE",
        as: "stock",
      });
      Product.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
      });

      Product.hasMany(models.CartItem, {
        foreignKey: "product_id",
        as: "cartItems",
      });

      Product.hasMany(models.Wishlist, {
        foreignKey: "product_id",
        as: "wishlistedBy",
      });
    }
  }
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      last_updated_restock_level: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      current_stock_level: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      deleted_at: {
        // Add the deletedAt field
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      defaultScope: {
        attributes: {
          exclude: ["created_at", "updated_at", "deleted_at"],
        },
      },
      paranoid: true, // Enable soft delete
      deletedAt: "deleted_at",
    }
  );

  return Product;
};
