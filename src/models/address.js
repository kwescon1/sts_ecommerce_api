"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      Address.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        constraints: false,
      });
    }
  }
  Address.init(
    {
      label: {
        type: DataTypes.STRING,
        defaultValue: "Billing",
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
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Address",
      tableName: "addresses",
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
  return Address;
};
