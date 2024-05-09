const multer = require("multer");
const fs = require("fs");
const { generateUniqueName } = require("../utilities/utils");

const uploadDirectory = "../../public/uploads";

// Create the directory if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadDirectory); // Destination folder for uploaded files
  },
  filename: function (req, file, callback) {
    const uniqueFilename = generateUniqueName(file.originalname);
    callback(null, uniqueFilename);
  },
});

// Initialize Multer middleware with custom storage options
const upload = multer({ storage: storage });

// Custom middleware to handle errors
const logger = require("../config/logging");

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred during upload
    logger.error("Multer error:", err.message);

    next(new Error(err.message));
  } else {
    // An unexpected error occurred
    logger.error("Unexpected error during upload:", err);

    next(new Error("Internal Server Error"));
  }
};

module.exports = { upload, handleUploadError };
