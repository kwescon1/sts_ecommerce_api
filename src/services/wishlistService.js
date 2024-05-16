const { Wishlist, Product } = require("../models");
const ConflictException = require("../exceptions/conflictException");
const NotFoundException = require("../exceptions/notFoundException");

class WishlistService {
  async addToWishlist(userId, productId) {
    const existingItem = await Wishlist.findOne({
      where: { user_id: userId, product_id: productId },
    });
    if (existingItem) {
      throw new ConflictException("Product exists already in wishlist");
    }
    return await Wishlist.create({ user_id: userId, product_id: productId });
  }

  async getWishlist(userId) {
    return await Wishlist.findAll({
      where: { user_id: userId },
      include: "product",
    });
  }

  async removeFromWishlist(userId, productId) {
    const wishlistItem = await Wishlist.findOne({
      where: { user_id: userId, product_id: productId },
    });
    if (!wishlistItem) {
      throw new NotFoundException("Product not found in wishlist.");
    }
    await wishlistItem.destroy();

    return true;
  }
}

module.exports = WishlistService;
