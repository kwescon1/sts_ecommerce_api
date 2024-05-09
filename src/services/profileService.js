const logger = require("../config/logging");
const ForbiddenException = require("../exceptions/forbiddenException");
const NotFoundException = require("../exceptions/notFoundException");
const ValidationException = require("../exceptions/validationException");
const { Address } = require("../models");
const { Op, where } = require("sequelize");

/**
 * Represents the service for managing profiles.
 * Encapsulates the business logic for profile operations.
 */
class ProfileService {
  /**
   * Stores address
   * @param {Object} data - The data for stored address.
   * @returns {Promise<Object>} A promise that resolves to the stored address.
   */
  async storeAddress(data, userId) {
    //check if user already has an address
    let userAddress = await Address.findOne({ where: { user_id: userId } });

    if (!userAddress) {
      // create one
      data.user_id = userId;
      userAddress = await Address.create(data);

      return userAddress;
    } else {
      // update the existing one

      await Address.update(data, { where: { user_id: userId } });

      userAddress = await Address.findOne({ where: { user_id: userId } });

      return userAddress;
    }
  }

  async getAddress(userId) {
    const address = await Address.findOne({ where: { user_id: userId } });

    if (!address) {
      throw new NotFoundException("User address not found");
    }
    return address;
  }
}

module.exports = ProfileService;
