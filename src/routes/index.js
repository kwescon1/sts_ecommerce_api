const express = require("express");
const registerRoutes = require("./registerRoutes");
const loginRoutes = require("./loginRoutes");
const tokenRoutes = require("./tokenRoutes");
const categoryRoutes = require("./categoryRoutes");
const profileRoutes = require("./profileRoutes");
const wishlistRoutes = require("./wishListRoutes");
const productRoutes = require("./productRoutes");
const stockRoutes = require("./stockRoutes");
const cartRoutes = require("./cartRoutes");
const checkoutRoutes = require("./checkoutRoutes");

// Create router instance
const router = express.Router();

router.use("/auth", registerRoutes);
router.use("/auth", loginRoutes);
router.use("/auth", tokenRoutes);
router.use("/categories", categoryRoutes);
router.use("/user", profileRoutes);
router.use("/user", wishlistRoutes);
router.use("/products", productRoutes);
router.use("/stocks/product", stockRoutes);
router.use("/cart", cartRoutes);
router.use("/checkout/cart", checkoutRoutes);

// export configured routes
module.exports = router;
