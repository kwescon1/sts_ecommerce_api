const { BadRequest } = require("http-errors");

const STRLEN_UNIQUE_SKU_NUMBER = 4;
const PREFIX = "SKU-";

/**
 * Generates a unique SKU based on the given parameters.
 *
 * @param {number} itemCategory - The item category ID.
 * @param {number} currentUniqueSkuNumber - The current unique SKU number.
 * @returns {string} The generated SKU.
 * @throws {Error}
 */
const generate = (itemCategory, currentUniqueSkuNumber) => {
  console.log(
    "Generating SKU with currentUniqueSkuNumber:",
    currentUniqueSkuNumber
  );
  validateUniqueSkuNumber(currentUniqueSkuNumber);
  const nextNumSeq = parseInt(currentUniqueSkuNumber) + 1;
  console.log("Next numeric sequence for SKU:", nextNumSeq);

  return make(itemCategory, nextNumSeq);
};

/**
 * Creates the SKU string from its components.
 *
 * @param {number} itemCategory - The item category ID.
 * @param {string} uniqueSkuNumber - The unique SKU number.
 * @returns {string} The generated SKU.
 */
const make = (itemCategory, uniqueSkuNumber) => {
  const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
  const sku = `${PREFIX}${date}${itemCategory}-${uniqueSkuNumber
    .toString()
    .padStart(STRLEN_UNIQUE_SKU_NUMBER, "0")}`;
  console.log("Generated SKU:", sku);
  return sku;
};

/**
 * Extracts the unique SKU number from the SKU string.
 *
 * @param {string} sku - The SKU string.
 * @returns {string} The extracted unique SKU number.
 */
const extractUniqueSkuNumber = (sku) => {
  console.log("Extracting unique SKU number from SKU:", sku);
  const parts = sku.split("-");
  console.log(parts.length);
  const uniqueSkuNumber = parts.length >= 3 ? parts[2] : undefined;
  console.log("Extracted unique SKU number:", uniqueSkuNumber);
  return uniqueSkuNumber;
};

/**
 * Validates the unique SKU number.
 *
 * @param {string} uniqueSkuNumber - The unique SKU number.
 * @throws {BadRequest}
 */
const validateUniqueSkuNumber = (uniqueSkuNumber) => {
  console.log("Validating unique SKU number:", uniqueSkuNumber);
  if (uniqueSkuNumber.toString().length > STRLEN_UNIQUE_SKU_NUMBER) {
    throw new BadRequest(
      `Unique SKU number should be a maximum of ${STRLEN_UNIQUE_SKU_NUMBER} chars. '${uniqueSkuNumber}' was provided`
    );
  }
  if (isNaN(uniqueSkuNumber)) {
    throw new BadRequest(
      `Unique SKU number should be numeric. '${uniqueSkuNumber}' was provided`
    );
  }
};

module.exports = {
  generate,
  make,
  extractUniqueSkuNumber,
  validateUniqueSkuNumber,
};
