"use strict";

const { hashData } = require("../utilities/utils");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const config = require("../config/config");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     */

    const dob = config.user.dob
      ? moment(config.user.dob).format("YYYY-MM-DD")
      : moment("1990-01-01").format("YYYY-MM-DD");

    const password = config.user.password
      ? hashData(config.user.password)
      : hashData("defaultPassword123");

    return queryInterface.bulkInsert(
      "users",
      [
        {
          id: uuidv4(),
          first_name: config.user.firstName || "Franque",
          last_name: config.user.lastName || "Armoako",
          username: config.user.username || "franque_armoako",
          dob: dob,
          password: password,
          email: config.user.email,
          is_admin: true,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("users", null, {});
  },
};
