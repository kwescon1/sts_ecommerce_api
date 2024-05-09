const logger = require("../config/logging");
const AddressResource = require("../resources/addressResource");
const UserResource = require("../resources/userResource");
class ProfileController {
  /**
   * CategoryController constructor.
   * Injects ProfileService for handling the business logic.
   * @param {ProfileService} profileService - The service for user profile operations.
   */
  constructor({ profileService }) {
    this.profileService = profileService;
  }

  /**
   * Handles the request to store category
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @param {Object} userId - The Authenticated user id.
   */
  async storeAddress(req, res, userId) {
    const address = await this.profileService.storeAddress(req.body, userId);
    const addressResource = new AddressResource(address);
    return res.success(
      { address: addressResource.toJson() },
      "User Address Updated"
    );
  }

  async getAddress(res, userId) {
    const userAddress = await this.profileService.getAddress(userId);

    res.success({ address: userAddress }, "Address retrieved successfully");
  }

  async suspendUserProfile(res, adminUserId, suspendUser) {
    const user = await this.profileService.suspendUserProfile(
      adminUserId,
      suspendUser
    );
    const userResource = new UserResource(user);
    return res.success({ user: userResource.toJson() }, "User suspended");
  }

  async unSuspendUserProfile(res, adminUserId, suspendedUser) {
    const user = await this.profileService.unSuspendUserProfile(
      adminUserId,
      suspendedUser
    );
    const userResource = new UserResource(user);
    return res.success(
      { user: userResource.toJson() },
      "User unsuspended successfully"
    );
  }
}

module.exports = ProfileController;
