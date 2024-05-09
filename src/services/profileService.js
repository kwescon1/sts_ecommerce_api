const logger = require("../config/logging");
const ConflictException = require("../exceptions/conflictException");
const ForbiddenException = require("../exceptions/forbiddenException");
const NotFoundException = require("../exceptions/notFoundException");
const ValidationException = require("../exceptions/validationException");
const { Address, User } = require("../models");
const { Op, where } = require("sequelize");

/**
 * Represents the service for managing profiles.
 * Encapsulates the business logic for profile operations.
 */
class ProfileService {
  constructor({ imageService }) {
    this.imageService = imageService;
  }
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

  async suspendUserProfile(adminUserId, suspendUser) {
    // Find the admin user
    const admin = await User.findByPk(adminUserId);

    // Find the user to be suspended
    const user = await User.findOne({ where: { username: suspendUser } });

    // Check if the user exists
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Check if the admin is the same as the user to be suspended
    if (admin.id === user.id) {
      throw new ForbiddenException("Admin cannot suspend their own account");
    }

    // Check if the user is already suspended
    if (user.is_suspended) {
      throw new ConflictException("User is already suspended");
    }

    // Perform suspension logic: Change the is_suspended field to true
    user.is_suspended = true;
    await user.save();

    // Return the suspended user along with success message
    return user;
  }

  async unSuspendUserProfile(adminUserId, suspendedUser) {
    const admin = await User.findByPk(adminUserId);

    const user = await User.findOne({ where: { username: suspendedUser } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Check if the user is already unsuspended
    if (!user.is_suspended) {
      throw new ConflictException("User is not suspended");
    }

    // Check if the admin is the same as the user, then refuse the unsuspension
    if (admin.id === user.id) {
      throw new ForbiddenException("Admin cannot unsuspend themselves");
    }

    // Unsuspend the user by setting is_suspended to false
    user.is_suspended = false;
    await user.save();

    // Return the unsuspended user
    return user;
  }

  async updateUserProfile(data, userId, file) {
    if (file) {
      data.image_url = await this.imageService.uploadFile(file);
    }

    let [updatedRowsCount] = await User.update(data, { where: { id: userId } });

    if (updatedRowsCount === 0) {
      throw new ConflictException("Failed to update user profile");
    }

    await User.update(data, { where: { id: userId } });

    return await User.scope("withImageIdentifier").findByPk(userId);
  }
}

module.exports = ProfileService;
