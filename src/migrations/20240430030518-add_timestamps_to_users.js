"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "created_at", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
    await queryInterface.addColumn("Users", "updated_at", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "created_at");
    await queryInterface.removeColumn("Users", "updated_at");
  },
};
