const multer = require("multer");
const fs = require("fs");
const { generateUniqueName } = require("../utilities/utils");
const ValidationException = require("../exceptions/validationException");

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

// Define upload limits
const uploadLimits = {
  fileSize: 5 * 1024 * 1024, // 5 MB limit (in bytes)
};

// Initialize Multer middleware with custom storage and limits
const upload = multer({
  storage: storage,
  limits: uploadLimits, // Add limits option
});

const validateImage = (req, res, next) => {
  // Check if a file is uploaded
  if (req.file) {
    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return next(
        new ValidationException("Only JPEG, PNG, and GIF images are allowed")
      );
    }

    // Check file size (in bytes)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      return next(
        new ValidationException(
          "Image size exceeds the maximum allowed size (5MB)"
        )
      );
    }
  }

  // If no image or if image passes validation, proceed to the next middleware
  next();
};

// Custom middleware to handle errors
const logger = require("../config/logging");

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      // File size limit exceeded
      return next(
        new ValidationException(
          "Image size exceeds the maximum allowed size (5MB)"
        )
      );
    } else {
      // Other Multer errors
      next(new Error("Error uploading file"));
    }
  } else {
    // An unexpected error occurred
    logger.error("Unexpected error during upload:", err);

    next(new Error("Internal Servers Error"));
  }
};

module.exports = { upload, validateImage, handleUploadError };
