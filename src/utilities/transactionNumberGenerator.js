const { BadRequest } = require("http-errors");

const NUM_SEQ_LIMIT = 99999; // Adjusted limit to 5 digits
const STRLEN_UNIQUE_TRANSACTION_NUMBER = 5;
const PREFIX = "TRA-";

/**
 * Generates a unique Transaction Number based on the given parameters.
 *
 * @param {string} currentUniqueTransactionNumber - The current unique Transaction number.
 * @returns {string} The generated Transaction Number.
 * @throws {Error}
 */
const generate = (currentUniqueTransactionNumber) => {
  validateUniqueTransactionNumber(currentUniqueTransactionNumber);
  let nextNumSeq = parseInt(currentUniqueTransactionNumber, 10) + 1;

  if (nextNumSeq > NUM_SEQ_LIMIT) {
    nextNumSeq = 1; // Reset the sequence
  }

  return makeTransactionNumber(nextNumSeq);
};

/**
 * Creates the Transaction Number string from its components.
 *
 * @param {string} uniqueTransactionNumber - The unique Transaction number.
 * @returns {string} The generated Transaction Number.
 */
const makeTransactionNumber = (uniqueTransactionNumber) => {
  const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
  return `${PREFIX}${date}-${uniqueTransactionNumber
    .toString()
    .padStart(STRLEN_UNIQUE_TRANSACTION_NUMBER, "0")}`;
};

/**
 * Extracts the unique Transaction number from the Transaction number string.
 *
 * @param {string} transactionNumber - The Transaction number string.
 * @returns {string} The extracted unique Transaction number.
 */
const extractUniqueTransactionNumber = (transactionNumber) => {
  return transactionNumber.split("-")[2];
};

/**
 * Validates the unique Transaction number.
 *
 * @param {string} uniqueTransactionNumber - The unique Transaction number.
 * @throws {BadRequest}
 */
const validateUniqueTransactionNumber = (uniqueTransactionNumber) => {
  if (uniqueTransactionNumber.length !== STRLEN_UNIQUE_TRANSACTION_NUMBER) {
    throw new BadRequest(
      `Unique Transaction number should be ${STRLEN_UNIQUE_TRANSACTION_NUMBER} chars. '${uniqueTransactionNumber}' was provided`
    );
  }
  if (isNaN(uniqueTransactionNumber)) {
    throw new BadRequest(
      `Unique Transaction number should be numeric. '${uniqueTransactionNumber}' was provided`
    );
  }
};

module.exports = {
  generate,
  makeTransactionNumber,
  extractUniqueTransactionNumber,
  validateUniqueTransactionNumber,
};
