import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Convert the import.meta.url to a file path for the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  // Combine the timestamp with the log message
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: loggerTransports,
});

export default logger;
