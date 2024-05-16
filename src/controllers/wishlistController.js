const { Wishlist, Product, User } = require("../models");
const GetWishlistResource = require("../resources/getWishlistResource");

class WishlistController {
  /**
   * WishlistController constructor.
   * Injects WishlistService for handling the business logic.
   * @param {WishlistService} wishlistService - The service for task operations.
   */
  constructor({ wishlistService }) {
    this.wishlistService = wishlistService;
  }
  async addToWishlist(req, res) {
    const { user_id, product_id } = req.body;

    const wishlistItem = await this.wishlistService.addToWishlist(
      user_id,
      product_id
    );

    const wishlisted = {
      product_id: wishlistItem.product_id,
      user_id: wishlistItem.user_id,
    };
    return res.created(wishlisted, "Product added to wishlist");
  }

  async getWishlist(req, res) {
    const { user_id } = req.params;

    const wishlist = await this.wishlistService.getWishlist(user_id);

    const wishlistResource = new GetWishlistResource(wishlist);

    return res.success(
      { wishlist: wishlistResource.toJson() },
      "Wishlist retrieved successfully"
    );
  }

  async removeFromWishlist(req, res) {
    const { user_id, product_id } = req.params;

    const wishlist = await this.wishlistService.removeFromWishlist(
      user_id,
      product_id
    );

    return res.success(wishlist, "Product removed from wishlist");
  }
}

module.exports = WishlistController;
