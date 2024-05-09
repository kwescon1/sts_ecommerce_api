// utils.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { v4: uuidv4 } = require("uuid");

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

const generateUniqueName = (file) => {
  const timestamp = Date.now();
  const uniqueId = uuidv4(); // Generate a UUID (Universally Unique Identifier)
  const fileExtension = file.split(".").pop(); // Get the file extension
  return `${timestamp}-${uniqueId}.${fileExtension}`; // Concatenate timestamp UUID, and file extension to create a unique filename
};

const extractProfileData = (body) => {
  const { first_name, last_name, username, email, image } = body;
  const data = { first_name, last_name, username, email, image };
  // Filter out empty values
  return Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== ""));
};

module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
  generateUniqueName,
  extractProfileData,
};
