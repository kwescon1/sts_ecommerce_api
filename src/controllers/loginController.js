const logger = require("../config/logging");
const UserResource = require("../resources/userResource");
class LoginController {
  /**
   * LoginController constructor.
   * Injects LoginService for handling the business logic.
   * @param {LoginService} loginService - The service for task operations.
   */
  constructor({ loginService }) {
    this.loginService = loginService;
  }

  /**
   * Handles the request to login user.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   */
  async login(req, res) {
    const { user, accessToken, refreshToken } = await this.loginService.login(
      req.body
    );

    const userResource = new UserResource(user);

    return res.success(
      { user: userResource.toJson(), accessToken, refreshToken },
      "Login successful"
    );
  }

  async logout(req, res) {
    const userId = req?.user?.id;

    const accessToken = req.headers["authorization"].split(" ")[1];

    success = await this.loginService.logout(userId, accessToken);

    if (!success) {
      res.error("Logout Failed");
    }
    return res.success(success, "Logout successful");
  }
}

module.exports = LoginController;
