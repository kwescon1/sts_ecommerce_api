const logger = require("../config/logging");
const UserResource = require("../resources/userResource");
class RegisterController {
  /**
   * RegisterController constructor.
   * Injects RegisterService for handling the business logic.
   * @param {RegisterService} registerService - The service for task operations.
   */
  constructor({ registerService }) {
    this.registerService = registerService;
  }

  /**
   * Handles the request to register user.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   */
  async register(req, res) {
    const { user, accessToken, refreshToken } =
      await this.registerService.register(req.body);

    const userResource = new UserResource(user);
    return res.created(
      { user: userResource.toJson(), accessToken, refreshToken },
      "Registration successful"
    );
  }
}

module.exports = RegisterController;
