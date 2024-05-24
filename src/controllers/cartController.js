class CartController {
  /**
   * CartController constructor.
   * Injects CartService for handling the business logic.
   * @param {cartService} cartService - The service for cart operations.
   */
  constructor({ cartService }) {
    this.cartService = cartService;
  }

  async storeCartItem(req, res, userId) {
    const data = req.body;

    const cartItem = await this.cartService.storeCartItem(userId, data);

    return res.created({ item: cartItem }, "Item added to cart");
  }

  async getUserCart(req, res) {
    const userId = req.user.id;
    const cartId = req.params.cart_id;

    const cart = await this.cartService.getUserCart(userId, cartId);

    return res.success({ cart: cart }, "User cart retrieved successfully");
  }

  async updateItemQuantity(req, res, cartId) {
    const data = req.body;
    const userId = req.user.id;

    const updated = await this.cartService.updateItemQuantity(
      data,
      userId,
      cartId
    );

    return res.success({ item: updated }, "Cart item updated");
  }

  async clearUserCart(req, res) {
    const userId = req.user.id;
    const cartId = req.params.cart_id;

    const clearedCart = await this.cartService.clearUserCart(userId, cartId);

    return res.success({ data: clearedCart }, "User cart cleared");
  }

  async getCartItemCount(req, res) {
    const userId = req.user.id;
    const cartId = req.params.cart_id;

    const itemCount = await this.cartService.getCartItemCount(userId, cartId);

    return res.created(
      { item_count: itemCount },
      `There are ${itemCount} items in cart`
    );
  }

  async deleteItemFromCart(req, res) {
    const userId = req.user.id;
    const cartId = req.params.cart_id;
    const productId = req.params.product_id;

    const deleteItem = await this.cartService.deleteItemFromCart(
      userId,
      cartId,
      productId
    );

    return res.success({ deleted: deleteItem }, "Item deleted from cart");
  }
}

module.exports = CartController;
