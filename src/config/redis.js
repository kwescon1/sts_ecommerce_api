const Redis = require("ioredis");
const config = require("./config"); //

function createRedisClient() {
  const redisOptions = {
    port: 6379,
    host: config.redis.host,
    // password: config.redis.password,
    db: 0, // Default DB
  };

  const redisClient = new Redis(redisOptions);

  redisClient.on("connect", () => console.log("Connected to Redis."));
  redisClient.on("error", (err) => console.error("Redis client error:", err));

  return redisClient;
}

module.exports = createRedisClient();
