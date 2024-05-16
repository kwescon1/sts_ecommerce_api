const express = require("express");
const validate = require("../requests/validateRequest");
const asyncHandler = require("../utilities/asyncHandler");
const authenticate = require("../middlewares/authenticate");
const isAdmin = require("../middlewares/isAdmin");
const {
  addressValidationRules,
  updateProfileValidationRules,
} = require("../requests/profileRequest");
const { extractProfileData } = require("../utilities/utils");
const {
  upload,
  handleUploadError,
  validateImage,
} = require("../middlewares/multer");
const ForbiddenException = require("../exceptions/forbiddenException");

// Create a new router instance.
const profileRoutes = express.Router();

// Middleware to attach the profileController to the request.
profileRoutes.use((req, res, next) => {
  // Resolve profileController from the DI container attached to the request.
  req.profileController = req.container.resolve("profileController");
  next();
});

/**
 * @swagger
 * tags:
 *   name: User Profile
 *   description: Endpoints for managing user profiles and addresses
 */

/**
 * @swagger
 * /api/v1/user/profile/address:
 *   post:
 *     summary: Add or update user address
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street_address:
 *                 type: string
 *                 description: The street address of the user's delivery address.
 *                 example: 25 ABC house
 *               city:
 *                 type: string
 *                 description: The city of the user's delivery address.
 *                 example: Accra
 *               postal_code:
 *                 type: string
 *                 description: The postal code of the user's delivery address.
 *                 example: GH-12356
 *               country:
 *                 type: string
 *                 description: The country of the user's delivery address.
 *                 example: USA
 *               label:
 *                 type: string
 *                 description: A label for the address (e.g., Home, Work).
 *                 example: Home
 *               state:
 *                 type: string
 *                 description: The state of the user's delivery address.
 *                 example: Greater Washington
 *     responses:
 *       200:
 *         description: User Address Updated
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
 *                     address:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         street_address:
 *                           type: string
 *                         city:
 *                           type: string
 *                         state:
 *                           type: string
 *                         postal_code:
 *                           type: string
 *                         country:
 *                           type: string
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               data:
 *                 address:
 *                   id: 1
 *                   street_address: "25 ABC house"
 *                   city: "Accra"
 *                   state: "Greater Washington"
 *                   postal_code: "GH-12356"
 *                   country: "USA"
 *               message: "User Address Updated"
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
 *                 - "Street address is required"
 *                 - "City is required"
 *                 - "Postal code is required"
 *                 - "Country is required"
 *                 - "Country must be a string"
 */
profileRoutes.post(
  "/profile/address",
  authenticate,
  addressValidationRules(),
  validate,
  asyncHandler((req, res) => {
    const userId = req?.user?.id;

    return req.profileController.storeAddress(req, res, userId);
  })
);

/**
 * @swagger
 * /api/v1/user/profile/address:
 *   get:
 *     summary: Retrieve user address
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Address retrieved successfully
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
 *                     address:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         label:
 *                           type: string
 *                         street_address:
 *                           type: string
 *                         city:
 *                           type: string
 *                         state:
 *                           type: string
 *                         postal_code:
 *                           type: string
 *                         country:
 *                           type: string
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               data:
 *                 address:
 *                   id: 1
 *                   label: "Billing"
 *                   street_address: "35 Bibiani street"
 *                   city: "London"
 *                   state: "Washington DC"
 *                   postal_code: "BBQ JJJ"
 *                   country: "USA"
 *               message: "Address retrieved successfully"
 *       404:
 *         description: User address not found
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
 *               error: "User address not found"
 */
profileRoutes.get(
  "/profile/address",
  authenticate,
  asyncHandler((req, res) => {
    const userId = req?.user?.id;

    return req.profileController.getAddress(res, userId);
  })
);

/**
 * @swagger
 * /api/v1/user/{username}/profile/suspend:
 *   get:
 *     summary: Suspends a user account by an admin user.
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     description: This endpoint requires both authentication and admin privileges.
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *           required: true
 *           description: The username of the user account to be suspended.
 *     responses:
 *       200:
 *         description: User suspended successfully
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
 *                         username:
 *                           type: string
 *                         is_suspended:
 *                           type: boolean
 *             example:
 *               success: true
 *               message: "User suspended successfully"
 *               data:
 *                 user:
 *                   id: "82eb4227-3e57-47f6-a9a0-92e975bc8f69"
 *                   username: "johndoe2024"
 *                   is_suspended: true
 *       404:
 *         description: User not found
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
 *               error: "User not found"
 */
profileRoutes.get(
  "/:username/profile/suspend",
  authenticate,
  isAdmin,
  asyncHandler((req, res) => {
    const suspendUser = req?.params?.username;
    const adminUserId = req?.user?.id;

    return req.profileController.suspendUserProfile(
      res,
      adminUserId,
      suspendUser
    );
  })
);

/**
 * @swagger
 * /api/v1/user/{username}/profile/unsuspend:
 *   get:
 *     summary: Unsuspends a user account by an admin user.
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     description: This endpoint requires both authentication and admin privileges.
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *           required: true
 *           description: The username of the user account to be unsuspended.
 *     responses:
 *       200:
 *         description: User unsuspended successfully
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
 *                         username:
 *                           type: string
 *                         is_suspended:
 *                           type: boolean
 *             example:
 *               success: true
 *               message: "User unsuspended successfully"
 *               data:
 *                 user:
 *                   id: "82eb4227-3e57-47f6-a9a0-92e975bc8f69"
 *                   username: "johndoe2024"
 *                   is_suspended: false
 *       404:
 *         description: User not found
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
 *               error: "User not found"
 *       409:
 *         description: User is not suspended
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
 *               error: "User is not suspended"
 */
profileRoutes.get(
  "/:username/profile/unsuspend",
  authenticate,
  isAdmin,
  asyncHandler((req, res) => {
    const suspendedUser = req?.params?.username;
    const adminUserId = req?.user?.id;

    return req.profileController.unSuspendUserProfile(
      res,
      adminUserId,
      suspendedUser
    );
  })
);

/**
 * @swagger
 * /api/v1/user/{id}/profile/update:
 *   put:
 *     summary: Updates the profile information of a user.
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: The id of the user account to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: The updated first name of the user.
 *                 example: John
 *               last_name:
 *                 type: string
 *                 description: The updated last name of the user.
 *                 example: Doe
 *               username:
 *                 type: string
 *                 description: The updated username of the user.
 *                 example: johndoe2024
 *               email:
 *                 type: string
 *                 description: The updated email address of the user.
 *                 example: johndoe@example.com
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The updated profile image of the user.
 *     responses:
 *       200:
 *         description: User profile updated successfully
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
 *                         image_url:
 *                           type: string
 *             example:
 *               success: true
 *               message: "User profile updated successfully"
 *               data:
 *                 user:
 *                   id: "6358581b-7bc0-4adc-a8b1-0fca7b4d6079"
 *                   first_name: "John"
 *                   last_name: "Doe"
 *                   username: "johndoe2024"
 *                   email: "johndoe@example.com"
 *                   image_url: "http:/images/johndoe2024_profile.jpeg"
 *       400:
 *         description: Invalid request body
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
 *               error: "Invalid request body"
 */
profileRoutes.put(
  "/:id/profile/update",
  authenticate,
  updateProfileValidationRules(),
  validate,
  (req, res, next) => {
    // Extract only the desired fields from the request body
    const data = extractProfileData(req.body);
    req.body = data; // Save the extracted data to the request object
    next(); // Proceed to the next middleware
  },
  upload.single("image"),
  validateImage,
  handleUploadError,
  asyncHandler((req, res, next) => {
    const userId = req?.params?.id;
    const data = req.body;
    const file = req?.file; // Get the uploaded file

    if (req?.user?.id != userId) {
      next(new ForbiddenException("Attempting to update different profile"));
    }
    return req.profileController.updateUserProfile(res, userId, data, file);
  })
);

/**
 * @swagger
 * /api/v1/user/{id}/profile:
 *   get:
 *     summary: Retrieves information about a user account
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: The id of the user account to be retrieved.
 *     responses:
 *       200:
 *         description: User Retrieved Successfully
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
 *                     id:
 *                       type: string
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     dob:
 *                       type: string
 *                       format: date
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     image_url:
 *                       type: string
 *                     is_admin:
 *                       type: boolean
 *                     is_suspended:
 *                       type: boolean
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     address:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         label:
 *                           type: string
 *                         street_address:
 *                           type: string
 *                         city:
 *                           type: string
 *                         state:
 *                           type: string
 *                         postal_code:
 *                           type: string
 *                         country:
 *                           type: string
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               data:
 *                 id: "c30d3d7b-c025-4d06-bef6-3709bb4b9e5c"
 *                 first_name: "Franque"
 *                 last_name: "Armoako"
 *                 dob: "1990-01-01"
 *                 username: "franque_armoako"
 *                 email: "franque_armoako@example.com"
 *                 image_url: "/images/user.jpeg"
 *                 is_admin: true
 *                 is_suspended: false
 *                 created_at: "2024-05-09T21:59:35.000Z"
 *                 address:
 *                   id: 1
 *                   label: "Billing"
 *                   street_address: "32 Hurstleigh Gardens"
 *                   city: "London"
 *                   state: "Washington DC"
 *                   postal_code: "IG5 0RQ"
 *                   country: "USA"
 *               message: "User Retrieved Successfully"
 *       403:
 *         description: Forbidden Action
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
 *               error: "Forbidden Action"
 */
profileRoutes.get(
  "/:id/profile",
  authenticate,
  asyncHandler((req, res, next) => {
    const userId = req?.params?.id;

    if (req?.user?.id != userId) {
      next(new ForbiddenException());
    }
    return req.profileController.getUserProfile(res, userId);
  })
);

/**
 * @swagger
 * /api/v1/user/{id}/profile:
 *   delete:
 *     summary: Deletes a user account from the system.
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: The id of the user account to be deleted.
 *     responses:
 *       200:
 *         description: User Account Deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               data: true
 *               message: "User Account Deleted"
 *        403:
 *         description: Forbidden. Access to the resource is denied.
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
 *               error: "Forbidden Action"
 */
profileRoutes.delete(
  "/:id/profile",
  authenticate,
  asyncHandler((req, res, next) => {
    const userId = req?.params?.id;

    if (req?.user?.id != userId) {
      next(new ForbiddenException());
    }
    return req.profileController.deleteUserAccount(res, userId);
  })
);

module.exports = profileRoutes;
