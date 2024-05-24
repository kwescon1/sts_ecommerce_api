"use strict";
const { Model, Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "order",
        constraints: false,
      });
      Transaction.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        constraints: false,
      });
    }
  }

  Transaction.init(
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
      transaction_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      order_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.INTEGER,
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
        type: DataTypes.INTEGER,
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
        type: DataTypes.ENUM("pending", "completed", "failed", "refunded"),
        allowNull: false,
        defaultValue: "pending",
      },
      transaction_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "transactions",
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

  return Transaction;
};
