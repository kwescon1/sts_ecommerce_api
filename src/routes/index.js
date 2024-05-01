const express = require("express");
const authRoutes = require("../routes/authRoutes");

// Create router instance
const router = express.Router();

router.use("/auth", authRoutes);

// export configured routes
module.exports = router;
