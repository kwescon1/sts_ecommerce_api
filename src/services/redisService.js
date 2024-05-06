const redisClient = require("../config/redis");

class RedisService {
  async set(key, value, expiry = 3600) {
    // Default expiry time set to 3600 seconds (1 hour)
    await redisClient.set(key, JSON.stringify(value), "EX", expiry);
  }

  async get(key) {
    const value = await redisClient.get(key);
    return JSON.parse(value);
  }

  async del(key) {
    await redisClient.del(key);
  }
}

module.exports = new RedisService();
