const logger = require("../config/logging");
const ValidationException = require("../exceptions/validationException");
const { User } = require("../models");
const { hashPassword } = require("../utilities/utils");
const TokenService = require("./tokenService");

/**
 * Represents the service for managing registering users.
 * Encapsulates the business logic for auth operations.
 */
class RegisterService extends TokenService {
  /**
   * Creates a new user with the provided data.
   * @param {Object} data - The data for the new user.
   * @returns {Promise<Object>} A promise that resolves to the created user.
   */
  async register(data) {
    const { username, email, password } = data;

    //verify if username does not already exist
    if (!(await this.#isUsernameUnique(username))) {
      throw new ValidationException("Username already exists");
    }

    // verify if email is unique
    if (!(await this.#isEmailUnique(email))) {
      throw new ValidationException("Email already exists");
    }

    const hashedPassword = hashPassword(password);

    data.password = hashedPassword;

    // Create the user
    const newUser = await User.create(data);

    // Generate a token for the new user
    const { accessToken, refreshToken } = this.generateToken(newUser);

    // Store the refresh token in the database
    await this.storeRefreshToken(refreshToken, newUser?.id);

    // return newUser with key user and token with key token
    return { user: newUser, accessToken, refreshToken };
  }

  #isUsernameUnique = async (username) => {
    const user = await User.findOne({ where: { username } });
    return !user; // Returns true if username is not found (i.e., unique)
  };

  #isEmailUnique = async (email) => {
    const user = await User.findOne({ where: { email } });
    return !user; // Returns true if email is not found (i.e., unique)
  };
}

module.exports = RegisterService;
