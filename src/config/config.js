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
    internal: 6379,
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
    secret: process.env.JWT_SECRET,
    accessExpiry: process.env.JWT_ACCESS_EXPIRY,
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY,
  },
  cloudinary: {
    url: process.env.CLOUDINARY_URL,
    key: process.env.CLOUDINARY_API_KEY,
    secret: process.env.CLOUDINARY_API_SECRET,
    name: process.env.CLOUDINARY_CLOUD_NAME,
    folder: process.env.CLOUDINARY_STORAGE_FOLDER,
  },
  crypto: {
    secretKey: process.env.CRYPTO_ENCRYPTION_KEY,
  },
};

module.exports = config;
