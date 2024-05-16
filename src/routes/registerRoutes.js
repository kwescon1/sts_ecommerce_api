const express = require("express");
const { userValidationRules } = require("../requests/registerRequest");
const validate = require("../requests/validateRequest");
const asyncHandler = require("../utilities/asyncHandler");

// Create a new router instance.
const registerRoutes = express.Router();

// Middleware to attach the registerController to the request.
registerRoutes.use((req, res, next) => {
  // Resolve registerController from the DI container attached to the request.
  req.registerController = req.container.resolve("registerController");
  next();
});

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and registration
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Registers a new user on the Crimson Inc. platform.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: The user's first name.
 *                 example: John
 *               last_name:
 *                 type: string
 *                 description: The user's last name.
 *                 example: Doe
 *               dob:
 *                 type: string
 *                 format: date
 *                 description: The user's date of birth in the format YYYY-MM-DD. The user must be at least 18 years old.
 *                 example: 1980-04-05
 *               username:
 *                 type: string
 *                 description: A unique username for the user. Must be alphanumeric and 5-20 characters long.
 *                 example: johndoe2024
 *               password:
 *                 type: string
 *                 description: A password for the user's account. Must be at least 8 characters long and include one number, one lowercase letter, one uppercase letter, and one special character. Cannot contain spaces.
 *                 example: SecurePassword123!
 *               password_confirmation:
 *                 type: string
 *                 description: A confirmation of the password. Must match the password.
 *                 example: SecurePassword123!
 *               email:
 *                 type: string
 *                 description: The user's email address. Must be a valid email address from the domain example.com and must not be longer than 254 characters. Cannot contain special characters like `/`, `\`, `<`, `>`, `&`.
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         first_name:
 *                           type: string
 *                         last_name:
 *                           type: string
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                         dob:
 *                           type: string
 *                           format: date
 *                         image_url:
 *                           type: string
 *                         is_admin:
 *                           type: boolean
 *                         is_suspended:
 *                           type: boolean
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *             example:
 *               success: true
 *               message: "Registration successful"
 *               data:
 *                 user:
 *                   id: "82eb4227-3e57-47f6-a9a0-92e975bc8f69"
 *                   first_name: "John"
 *                   last_name: "Doe"
 *                   username: "johndoe2024"
 *                   email: "johndoe@example.com"
 *                   dob: "1980-04-05"
 *                   image_url: "/images/user.jpeg"
 *                   is_admin: false
 *                   is_suspended: false
 *                 accessToken: "<access-token>"
 *                 refreshToken: "<refresh-token>"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: array
 *                   items:
 *                     type: string
 *             example:
 *               success: false
 *               error:
 *                 - "First name (first_name) is required."
 *                 - "Username (username) is required."
 *                 - "Username (username) must be alphanumeric."
 *                 - "Username (username) must be between 5 and 20 characters long."
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *             example:
 *               success: false
 *               error: "Username already exists"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *             example:
 *               success: false
 *               error: "Server error"
 */
registerRoutes.post(
  "/register",
  userValidationRules(),
  validate,
  asyncHandler((req, res) => req.registerController.register(req, res))
);

module.exports = registerRoutes;
