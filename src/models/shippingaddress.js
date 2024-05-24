"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ShippingAddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      ShippingAddress.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        constraints: false,
      });

      ShippingAddress.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "order",
        constraints: false,
      });
    }
  }
  ShippingAddress.init(
    {
      label: {
        type: DataTypes.STRING,
        defaultValue: "Shipping",
      },
      street_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        defaultValue: "Ghana",
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      order_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ShippingAddress",
      tableName: "shipping_addresses",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      defaultScope: {
        attributes: {
          exclude: ["user_id", "created_at", "updated_at", "deleted_at"],
        },
      },
      paranoid: true, // Enable soft delete
      deletedAt: "deleted_at",
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
  return ShippingAddress;
};
