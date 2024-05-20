const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const algorithm = "aes-256-ctr";
const secretKey = Buffer.from(config.crypto.secretKey, "hex");

/**
 * Hashes data using bcrypt with a predefined salt rounds.
 * @param {string} data - The data to hash.
 * @returns {string} - The hashed data.
 */
const hashData = (data) => {
  const saltRounds = 10;
  return bcrypt.hashSync(data, saltRounds);
};

/**
 * Verifies a password against a hashed password.
 * @param {string} password - The password to verify.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {boolean} - Whether the password is valid.
 */
const verifyPassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

/**
 * Verifies a JWT token.
 * @param {string} token - The token to verify.
 * @returns {object} - The decoded token.
 */
const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

/**
 * Generates a unique filename.
 * @param {string} file - The original filename.
 * @returns {string} - The unique filename.
 */
const generateUniqueName = (file) => {
  const timestamp = Date.now();
  const uniqueId = uuidv4(); // Generate a UUID (Universally Unique Identifier)
  const fileExtension = file.split(".").pop(); // Get the file extension
  return `${timestamp}-${uniqueId}.${fileExtension}`; // Concatenate timestamp UUID, and file extension to create a unique filename
};

/**
 * Encrypts data using AES-256-CTR algorithm.
 * @param {string} data - The data to encrypt.
 * @returns {object} - The encrypted data and IV.
 */
const encrypt = (data) => {
  // Check if the data is not a string, then convert it to a JSON string
  if (typeof data !== "string") {
    data = JSON.stringify(data);
  }

  const iv = crypto.randomBytes(16); // Generate a random initialization vector
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

/**
 * Decrypts data using AES-256-CTR algorithm.
 * @param {object} hash - The encrypted data and IV.
 * @returns {string} - The decrypted data.
 */
const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(hash.iv, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);

  // Try to parse the decrypted data as JSON. If parsing fails, return as a string
  let decryptedData;
  try {
    decryptedData = JSON.parse(decrypted.toString());
  } catch (e) {
    decryptedData = decrypted.toString();
  }

  return decryptedData;
};

/**
 * Extracts profile data from the request body.
 * @param {object} body - The request body.
 * @returns {object} - The extracted profile data.
 */
const extractProfileData = (body) => {
  const { first_name, last_name, username, email, image } = body;
  const data = { first_name, last_name, username, email, image };
  // Filter out empty values
  return Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== ""));
};

/**
 * Extracts product data from the request body.
 * @param {object} body - The request body.
 * @returns {object} - The extracted product data.
 */
const extractProductData = (body) => {
  const { name, category_id } = body;
  const data = { name, category_id };
  // Filter out empty values
  return Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== ""));
};

/**
 * Extracts stock data from the request body.
 * @param {object} body - The request body.
 * @returns {object} - The extracted stock data.
 */
const extractStockData = (body) => {
  const { retail_price, cost_price, quantity, comment } = body;
  const data = { retail_price, cost_price, quantity, comment };
  // Filter out empty values
  return Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== ""));
};

module.exports = {
  hashData,
  verifyPassword,
  verifyToken,
  generateUniqueName,
  encrypt,
  decrypt,
  extractProfileData,
  extractProductData,
  extractStockData,
};
