const express = require("express");
const { loginValidationRules } = require("../requests/loginRequest");
const validate = require("../requests/validateRequest");
const asyncHandler = require("../utilities/asyncHandler");
const authenticate = require("../middlewares/authenticate");

// Create a new router instance.
const loginRoutes = express.Router();

// Middleware to attach the loginController to the request.
loginRoutes.use((req, res, next) => {
  // Resolve loginController from the DI container attached to the request.
  req.loginController = req.container.resolve("loginController");
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
 * /api/v1/auth/login:
 *   post:
 *     summary: Authenticates a user and returns access and refresh tokens.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 example: user7
 *               password:
 *                 type: string
 *                 description: The password associated with the user's account.
 *                 example: SecurePassword123!
 *     responses:
 *       200:
 *         description: Login successful
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
 *               message: "Login successful"
 *               data:
 *                 user:
 *                   id: "82eb4227-3e57-47f6-a9a0-92e975bc8f69"
 *                   first_name: "Kwesi"
 *                   last_name: "Kwesi"
 *                   username: "user7"
 *                   email: "kwesi7@example.com"
 *                   dob: "1990-01-07"
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
 *               error: ["Username (username) is required."]
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
loginRoutes.post(
  "/login",
  loginValidationRules(),
  validate,
  asyncHandler((req, res) => req.loginController.login(req, res))
);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logs out a user by invalidating the user's current access token.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
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
 *                   type: boolean
 *             example:
 *               success: true
 *               message: "Logout successful"
 *               data: true
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
 *                   type: string
 *             example:
 *               success: false
 *               error: "Logout Failed"
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
loginRoutes.post(
  "/logout",
  authenticate,
  asyncHandler((req, res) => req.loginController.logout(req, res))
);

module.exports = loginRoutes;
