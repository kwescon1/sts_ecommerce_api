// utils.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

/**
 * Hashes a password using bcrypt with a predefined salt rounds.
 * @param {string} password - The password to hash.
 * @returns {string} - The hashed password.
 */
const hashPassword = (password) => {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
};

const verifyPassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
};
