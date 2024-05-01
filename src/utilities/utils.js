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

const generateToken = (user) => {
  const secret = config.jwt.secret;

  const expiresIn = config.jwt.expiry;

  const payload = {
    id: user.id,
    username: user.username,
    isAdmin: user.is_admin,
    isSuspended: user.is_suspended,
  };

  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = {
  hashPassword,
  generateToken,
};
