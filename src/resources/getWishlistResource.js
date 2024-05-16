/**
 * @class WishlistResource
 */
class GetWishlistResource {
  /**
   * Constructs an instance of WishlistResource with a wishlist object.
   *
   * @param {Array} wishlistItems - The wishlist items array containing data to be transformed.
   */
  constructor(wishlistItems) {
    this.wishlistItems = wishlistItems;
  }

  /**
   * Transforms the wishlist items array into a JSON-friendly format
   * @returns {Object}
   */
  toJson() {
    if (!this.wishlistItems || this.wishlistItems.length === 0) {
      return {
        id: null,
        user_id: null,
        products: [],
      };
    }

    const userId = this.wishlistItems[0]?.user_id || null;
    const wishlistId = this.wishlistItems[0]?.id || null;

    const products = this.wishlistItems.map((item) => ({
      id: item.product?.id || null,
      name: item.product?.name || null,
      sku: item.product?.sku || null,
      category_id: item.product?.category_id || null,
      last_updated_restock_level:
        item.product?.last_updated_restock_level || null,
      current_stock_level: item.product?.current_stock_level || null,
    }));

    return {
      id: wishlistId,
      user_id: userId,
      products,
    };
  }
}

module.exports = GetWishlistResource;
