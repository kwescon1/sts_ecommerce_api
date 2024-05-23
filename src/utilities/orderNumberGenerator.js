const { BadRequest } = require("http-errors");

const NUM_SEQ_LIMIT = 99999; // Adjusted limit to 5 digits
const STRLEN_UNIQUE_ORDER_NUMBER = 5;
const PREFIX = "ORD-";

/**
 * Generates a unique Order Number based on the given parameters.
 *
 * @param {string} currentUniqueOrderNumber - The current unique Order number.
 * @returns {string} The generated Order Number.
 * @throws {Error}
 */
const generate = (currentUniqueOrderNumber) => {
  validateUniqueOrderNumber(currentUniqueOrderNumber);
  let nextNumSeq = parseInt(currentUniqueOrderNumber, 10) + 1;

  if (nextNumSeq > NUM_SEQ_LIMIT) {
    nextNumSeq = 1; // Reset the sequence
  }

  return makeOrderNumber(nextNumSeq);
};

/**
 * Creates the Order Number string from its components.
 *
 * @param {string} uniqueOrderNumber - The unique Order number.
 * @returns {string} The generated Order Number.
 */
const makeOrderNumber = (uniqueOrderNumber) => {
  const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
  return `${PREFIX}${date}-${uniqueOrderNumber
    .toString()
    .padStart(STRLEN_UNIQUE_ORDER_NUMBER, "0")}`;
};

/**
 * Extracts the unique Order number from the Order number string.
 *
 * @param {string} orderNumber - The Order number string.
 * @returns {string} The extracted unique Order number.
 */
const extractUniqueOrderNumber = (orderNumber) => {
  return orderNumber.split("-")[2];
};

/**
 * Validates the unique Order number.
 *
 * @param {string} uniqueOrderNumber - The unique Order number.
 * @throws {BadRequest}
 */
const validateUniqueOrderNumber = (uniqueOrderNumber) => {
  if (uniqueOrderNumber.length !== STRLEN_UNIQUE_ORDER_NUMBER) {
    throw new BadRequest(
      `Unique Order number should be ${STRLEN_UNIQUE_ORDER_NUMBER} chars. '${uniqueOrderNumber}' was provided`
    );
  }
  if (isNaN(uniqueOrderNumber)) {
    throw new BadRequest(
      `Unique Order number should be numeric. '${uniqueOrderNumber}' was provided`
    );
  }
};

module.exports = {
  generate,
  makeOrderNumber,
  extractUniqueOrderNumber,
  validateUniqueOrderNumber,
};
