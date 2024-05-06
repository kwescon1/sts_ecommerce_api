const express = require("express");
const registerRoutes = require("./registerRoutes");
const loginRoutes = require("./loginRoutes");
const tokenRoutes = require("./tokenRoutes");

// Create router instance
const router = express.Router();

router.use("/auth", registerRoutes);
router.use("/auth", loginRoutes);
router.use("/auth", tokenRoutes);

// export configured routes
module.exports = router;
