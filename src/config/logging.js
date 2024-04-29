const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");
const fs = require("fs");

// __dirname is already defined in CommonJS environment
// __filename is already defined as well, representing this file's path

// Construct the path to the root directory by moving up from the current directory (__dirname)
const rootDirectory = path.join(__dirname, "../..");

// Ensure log directory exists
const logDirectory = path.join(rootDirectory, "storage", "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Create a daily rotate file transport
const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDirectory}/app-%DATE%.log`,
  datePattern: "YYYY-MM-DD",
});

const loggerTransports = [dailyRotateFileTransport];

// Conditionally add console transport if not in production environment
if (process.env.APP_ENV !== "production") {
  loggerTransports.push(
    new transports.Console({
      level: process.env.LOG_LEVEL || "debug",
      format: format.combine(
        format.colorize(),
        format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    })
  );
}

// Create a logger
const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: loggerTransports,
});

module.exports = logger;
