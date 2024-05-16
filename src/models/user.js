"use strict";
const { Model } = require("sequelize");
const ValidationException = require("../exceptions/validationException");
const logger = require("../config/logging");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.RefreshToken, {
        foreignKey: "user_id",
        as: "refreshTokens",
        onDelete: "CASCADE",
      });

      User.hasOne(models.Address, {
        foreignKey: "user_id",
        as: "address",
        onDelete: "CASCADE",
      });

      // User.hasMany(models.Order, {
      //   foreignKey: "user_id",
      //   as: "orders",
      // });

      User.hasOne(models.Cart, {
        foreignKey: "user_id",
        as: "cart",
        onDelete: "CASCADE",
      });

      // User.hasMany(models.Transaction, {
      //   foreignKey: "user_id",
      //   as: "transactions",
      //   onDelete: "CASCADE",
      // });

      User.hasMany(models.Wishlist, {
        foreignKey: "user_id",
        as: "wishlists",
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isOldEnough(value) {
            const eighteenYearsAgo = new Date();
            eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

            if (new Date(value) > eighteenYearsAgo) {
              logger.error("User age must be 18 or greater");
              throw new ValidationException(
                "User must be at least 18 years old to register"
              );
            }
          },
        },
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "/images/user.jpeg",
      },
      image_identifier: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_suspended: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
      defaultScope: {
        attributes: {
          exclude: [
            "password",
            "created_at",
            "updated_at",
            "deleted_at",
            "image_identifier",
          ],
        },
      },
      scopes: {
        withPassword: {
          attributes: { include: ["password"] },
        },
        withCreatedAt: {
          attributes: { include: ["created_at"] },
        },

        isSuspended: {
          where: {
            is_suspended: true,
          },
        },
        withImageIdentifier: {
          attributes: { include: ["image_identifier"] },
        },
      },
    }
  );

  return User;
};
