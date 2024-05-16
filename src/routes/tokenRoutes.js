const express = require("express");
const asyncHandler = require("../utilities/asyncHandler");
const { tokenValidationRules } = require("../requests/refreshTokenRequest");
const validate = require("../requests/validateRequest");

// Create a new router instance.
const tokenRoutes = express.Router();

// Middleware to attach the loginController to the request.
tokenRoutes.use((req, res, next) => {
  // Resolve tokenController from the DI container attached to the request.
  req.tokenController = req.container.resolve("tokenController");
  next();
});

/**
 * @swagger
 * tags:
 *   name: Token Management
 *   description: Endpoints for managing access and refresh tokens
 */

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refreshes an expired access token using a valid refresh token.
 *     tags: [Token Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 description: A string representing the refresh token.
 *                 example: "<refresh_token>"
 *     responses:
 *       200:
 *         description: Token generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               data:
 *                 accessToken: "<new_access_token>"
 *                 refreshToken: "<new_refresh_token>"
 *               message: "Token generated successfully."
 *       400:
 *         description: Invalid refresh token
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
 *               error: "Invalid refresh token"
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
tokenRoutes.post(
  "/refresh-token",
  tokenValidationRules(),
  validate,
  asyncHandler((req, res) => req.tokenController.refreshAccessToken(req, res))
);

module.exports = tokenRoutes;
