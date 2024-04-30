// utils.js
const bcrypt = require("bcryptjs");

/**
 * Hashes a password using bcrypt with a predefined salt rounds.
 * @param {string} password - The password to hash.
 * @returns {string} - The hashed password.
 */
const hashPassword = (password) => {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
};

module.exports = {
  hashPassword,
};
