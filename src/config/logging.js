const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");
const fs = require("fs");
const config = require("./config");

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
if (config.app.environment !== "production") {
  loggerTransports.push(
    new transports.Console({
      level: config.app.logLevel || "debug",
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
