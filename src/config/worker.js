// workerConfig.js
const config = require("./config");

const redisConfig = {
  redis: {
    host: config.redis.host,
    port: config.redis.internal,
  },
};

const defaultQueue = "default_queue"; // Default queue name
const registeredUserQueue = "registered_users";
const deletedUserQueue = "deleted_users";
const suspendeUserQueue = "suspended_users";
const suspensionRemovedQueue = "unsuspended_users";

module.exports = {
  defaultQueue,
  registeredUserQueue,
  deletedUserQueue,
  suspendeUserQueue,
  suspensionRemovedQueue,
  redisConfig,
};
