const ConflictException = require("../exceptions/conflictException");
const ForbiddenException = require("../exceptions/forbiddenException");
const NotFoundException = require("../exceptions/notFoundException");
const { Address, User } = require("../models");
const SuspendedUser = require("../workers/suspendedUser");
const DeletedUser = require("../workers/deletedUser");
const RemovedSuspension = require("../workers/suspensionRemoved");

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

    // Dispatched Suspended User Email
    SuspendedUser.enqueueSuspendedUserEmail({
      to: user.email,
      clientName: `${user.first_name} ${user.last_name}`,
    });

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

    // Dispatched Suspension Removal Email
    RemovedSuspension.enqueueRemovedSuspensionEmail({
      to: user.email,
      clientName: `${user.first_name} ${user.last_name}`,
    });

    // Return the unsuspended user
    return user;
  }

  async updateUserProfile(data, userId, file) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ConflictException("User not found");
    }

    // Check if a new file is uploaded and if the user already has an image
    if (file && user.image_identifier) {
      // Attempt to delete the old image from the cloud
      try {
        await this.imageService.deleteFile(user.image_identifier);
      } catch (error) {
        throw new Error("Failed to delete old profile image");
      }
    }

    // If a new file is provided, upload it
    if (file) {
      const { secure_url, public_id } = await this.imageService.uploadFile(
        file
      );
      data.image_url = secure_url;
      data.image_identifier = public_id;
    }

    // Update the user profile with new data
    const [updatedRowsCount] = await User.update(data, {
      where: { id: userId },
    });
    if (updatedRowsCount === 0) {
      throw new ConflictException("Failed to update user profile");
    }

    // Return the updated user profile
    return await User.scope("withImageIdentifier").findByPk(userId);
  }

  async getUserProfile(userId) {
    const user = await User.scope(["defaultScope", "withCreatedAt"]).findByPk(
      userId,
      {
        include: "address",
      }
    );

    if (!user) {
      throw new ConflictException("User not found");
    }

    return user;
  }

  async deleteUserAccount(userId) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new ConflictException("User not found");
    }

    if (user && user?.is_suspended) {
      throw new ForbiddenException("Suspended user");
    }

    await User.destroy({ where: { id: userId } });

    // Dispatched Deleted User Email
    DeletedUser.enqueueDeletedUserEmail({
      to: user.email,
      clientName: `${user.first_name} ${user.last_name}`,
    });

    return true;
  }
}

module.exports = ProfileService;
