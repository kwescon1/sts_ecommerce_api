const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { RefreshToken } = require("../models");
const moment = require("moment");

class TokenService {
  async storeRefreshToken(token, userId, expires = moment().add(7, "days")) {
    return await RefreshToken.create({
      token,
      user_id: userId,
      expires,
    });
  }

  generateToken(user) {
    const secret = config.jwt.secret;

    const accessExpiresIn = config.jwt.accessExpiry || "15m";
    const refreshExpiresIn = config.jwt.expiry || "7d";

    const payload = {
      id: user?.id,
      username: user?.username,
      is_admin: user?.is_admin,
      is_suspended: user?.is_suspended,
    };

    const accessToken = jwt.sign(payload, secret, {
      expiresIn: accessExpiresIn,
    });
    const refreshToken = jwt.sign({ id: user.id }, secret, {
      expiresIn: refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }
}

module.exports = TokenService;
