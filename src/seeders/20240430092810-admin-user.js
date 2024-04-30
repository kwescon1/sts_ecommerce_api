"use strict";

const { hashPassword } = require("../utilities/utils");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     */

    const dob = process.env.DOB
      ? moment(process.env.DOB).format("YYYY-MM-DD")
      : moment("1990-01-01").format("YYYY-MM-DD");

    const password = process.env.PASSWORD
      ? hashPassword(process.env.PASSWORD)
      : hashPassword("defaultPassword123");

    return queryInterface.bulkInsert(
      "users",
      [
        {
          id: uuidv4(),
          first_name: process.env.FIRST_NAME || "Franque",
          last_name: process.env.LAST_NAME || "Armoako",
          username: process.env.USERNAME || "franque_armoako",
          dob: dob,
          password: password,
          email: process.env.EMAIL,
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
