"use strict";
const { Model } = require("sequelize");
const ValidationException = require("../exceptions/validationException");
const logger = require("../config/logging");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define associations here, if any
      User.hasMany(models.RefreshToken, {
        foreignKey: "user_id",
        as: "refreshTokens",
        onDelete: "CASCADE",
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
      is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_suspended: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      defaultScope: {
        attributes: {
          exclude: ["password", "created_at", "updated_at"],
        },
      },
      scopes: {
        withPassword: {
          attributes: { include: ["password"] },
        },
        isSuspended: {
          where: {
            is_suspended: true,
          },
        },
      },
    }
  );

  return User;
};
