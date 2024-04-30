const config = {
  app: {
    name: process.env.APP_NAME,
    environment: process.env.APP_ENV,
    debug: process.env.APP_DEBUG === "true",
    url: process.env.APP_URL,
    port: process.env.PORT,
    logLevel: process.env.LOG_LEVEL,
  },
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    connection: process.env.DB_CONNECTION,
  },
  redis: {
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT,
  },
  mail: {
    mailer: process.env.MAIL_MAILER,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
    encryption: process.env.MAIL_ENCRYPTION,
    fromAddress: process.env.MAIL_FROM_ADDRESS || "no-reply@example.com",
    fromName: process.env.MAIL_FROM_NAME,
  },
  user: {
    firstName: process.env.FIRST_NAME,
    lastName: process.env.LAST_NAME,
    username: process.env.USERNAME,
    dob: process.env.DOB,
    password: process.env.PASSWORD,
    email: process.env.EMAIL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your_secret",
    expiry: process.env.JWT_EXPIRY || "1h",
  },
};

module.exports = config;
