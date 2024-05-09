const config = require("../config/config");
const cloudinary = require("cloudinary").v2;
// const sharp = require("sharp");
const fs = require("fs");
const ValidationException = require("../exceptions/validationException");
const ConflictException = require("../exceptions/conflictException");

// Define allowed file extensions
const allowedExtensions = ["jpeg", "jpg", "png"];

/**
 * Represents the service for handling images.
 *
 */
class ImageService {
  constructor() {
    cloudinary.config({
      cloud_name: config.cloudinary.name,
      api_key: config.cloudinary.key,
      api_secret: config.cloudinary.secret,
    });
  }

  /**
   * Uploads a file to Cloudinary.
   * @param {Object} file - The file to upload.
   * @param {boolean} resizeImage - Whether to resize the image before uploading.
   * @param {string} publicId - The public ID for the uploaded file (optional).
   * @returns {Object} An object containing the secure URL and public ID of the uploaded file.
   */
  async uploadFile(file, publicId = null) {
    try {
      // Check if file is uploaded
      if (!file || !file.path) {
        throw new ConflictException("No file uploaded");
      }

      // Upload file to Cloudinary
      let options = { folder: this.getFolderName() };
      if (publicId) {
        options.public_id = publicId;
      }
      const result = await cloudinary.uploader.upload(file.path, options);

      // Return the uploaded file details
      return {
        secure_url: result.secure_url,
        public_id: result.public_id,
      };
    } catch (error) {
      throw new Error("Failed to upload file: " + error.message);
    }
  }

  /**
   * Deletes a file from Cloudinary.
   * @param {string} publicId - The public ID of the file to delete.
   */
  async deleteFile(publicId) {
    try {
      if (!publicId) {
        throw new ConflictException("Public ID is required");
      }
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new Error("Failed to delete file: " + error.message);
    }
  }

  /**
   * Gets the folder name based on the current date.
   * @returns {string} The folder name.
   */
  getFolderName() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
  }
}

module.exports = new ImageService();
