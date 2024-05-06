const logger = require("../config/logging");
class TokenController {
  /**
   * TokenController constructor.
   * Injects TokenService for handling the business logic.
   * @param {TokenService} tokenService - The service for task operations.
   */
  constructor({ tokenService }) {
    this.tokenService = tokenService;
  }

  /**
   * Handles the request to create new access tokens.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   */
  async refreshAccessToken(req, res) {
    const currentRefreshToken = req?.body?.refresh_token;

    const { accessToken, refreshToken } =
      await this.tokenService.refreshAccessToken(currentRefreshToken);

    return res.success({ accessToken, refreshToken }, "Token generated");
  }
}

module.exports = TokenController;
