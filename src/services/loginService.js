const logger = require("../config/logging");
const ForbiddenException = require("../exceptions/forbiddenException");
const ValidationException = require("../exceptions/validationException");
const { User } = require("../models");
const TokenService = require("../services/tokenService");
const { verifyPassword } = require("../utilities/utils");
/**
 * Represents the service for managing registering users.
 * Encapsulates the business logic for auth operations.
 */
class LoginService extends TokenService {
  /**
   * Logs a user into the system
   * @param {Object} data - The data for the logged in user.
   * @returns {Promise<Object>} A promise that resolves to the logged in user.
   */
  async login(data) {
    const { username, password } = data;

    //fetch user data
    const user = await this.#isUser(username);

    if (!user || !verifyPassword(password, user?.password)) {
      throw new ValidationException("Incorrect Username or Password");
    }

    if (user?.is_suspended) {
      throw new ForbiddenException("Suspended User");
    }

    // Generate a token for the user
    const { accessToken, refreshToken } = this.generateToken(user);

    // Store the refresh token in the database
    await this.storeRefreshToken(refreshToken, user?.id);

    // return user with key user and token with key token
    return { user, accessToken, refreshToken };
  }

  async logout(userId) {
    return this.destroyToken(userId);
  }

  #isUser = async (username) => {
    return await User.scope("withPassword").findOne({
      where: { username },
    });
  };
}

module.exports = LoginService;
