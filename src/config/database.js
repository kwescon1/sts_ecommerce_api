const config = require("./config");
module.exports = {
  local: {
    use_env_variable: "DATABASE_URL",
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.connection,
    dialectOptions: {
      bigNumberStrings: true,
    },
  },
};
