const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { RefreshToken, User } = require("../models");
const moment = require("moment");
const ValidationException = require("../exceptions/validationException");
const { verifyToken } = require("../utilities/utils");
const ForbiddenException = require("../exceptions/forbiddenException");

class TokenService {
  constructor({ redisService }) {
    this.redisService = redisService;
  }

  async storeRefreshToken(token, userId, expires = moment().add(7, "days")) {
    return await RefreshToken.create({
      token,
      user_id: userId,
      expires,
    });
  }

  generateToken(user) {
    const payload = this.createTokenPayload(user);
    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.accessExpiry || "15m",
    });
    const refreshToken = jwt.sign({ id: user?.id }, config.jwt.secret, {
      expiresIn: config.jwt.refreshExpiry || "1d",
    });

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken) {
    // Verify the existing refresh token
    try {
      verifyToken(refreshToken, config.jwt.secret);
    } catch (error) {
      throw new ValidationException("Invalid Refresh Token");
    }

    const tokenRecord = await this.validateRefreshToken(refreshToken);

    const user = await User.findByPk(tokenRecord.user_id);
    if (!user) throw new ValidationException("User not found");

    if (tokenRecord.count >= 5) {
      await RefreshToken.destroy({ where: { id: tokenRecord.id } });
      return this.generateToken(user);
    } else {
      tokenRecord.count += 1;
      await tokenRecord.save();

      const accessToken = jwt.sign(
        this.createTokenPayload(user),
        config.jwt.secret,
        {
          expiresIn: config.jwt.accessExpiry,
        }
      );

      return { accessToken, refreshToken };
    }
  }

  async destroyToken(userId, accessToken) {
    await RefreshToken.destroy({ where: { user_id: userId } });
    await this.invalidateToken(accessToken);
    return true;
  }

  async invalidateToken(accessToken) {
    const expiryTime = this.decodeTokenTime(accessToken);
    if (expiryTime <= 0) throw new ValidationException("No token expiry time");

    const remainingTime = expiryTime - Math.floor(Date.now() / 1000);
    if (remainingTime > 0) {
      return await this.redisService.set(
        `blacklist_${accessToken}`,
        true,
        remainingTime
      );
    }
  }

  createTokenPayload(user) {
    return {
      id: user.id,
      username: user.username,
      is_admin: user.is_admin,
      is_suspended: user.is_suspended,
    };
  }

  decodeTokenTime(accessToken) {
    const decodedToken = jwt.decode(accessToken);
    return decodedToken?.exp || 0;
  }

  async validateRefreshToken(refreshToken) {
    const tokenRecord = await RefreshToken.findOne({
      where: { token: refreshToken },
    });
    if (!tokenRecord) throw new ValidationException("Invalid refresh token");
    return tokenRecord;
  }
}

module.exports = TokenService;
