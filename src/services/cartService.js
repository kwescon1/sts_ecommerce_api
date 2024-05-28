const { sequelize, Cart, CartItem, Product, Stock } = require("../models");
const ConflictException = require("../exceptions/conflictException");
const NotFoundException = require("../exceptions/notFoundException");
const { encrypt } = require("../utilities/utils");
const CartResource = require("../resources/getCartResource");
const CART_CACHE_KEY = "CART-";
/**
 * Represents the service for managing cart.
 * Encapsulates the business logic for cart operations.
 */
class CartService {
  constructor({ redisService }) {
    this.redisService = redisService;
  }

  static CART_KEY = CART_CACHE_KEY;

  async storeCartItem(userId, data) {
    return await sequelize.transaction(async (transaction) => {
      // Get user current cart id
      const currentCart = await this.getUserCurrentCart(userId, transaction);
      data.cart_id = currentCart.id;

      // Check if product exists
      const product = await Product.findByPk(data.product_id, {
        include: [{ model: Stock, as: "stock" }],
        transaction,
      });

      if (!product) {
        throw new NotFoundException("Product not found");
      }

      // Check if the quantity requested is available in stock
      if (product.stock.quantity < data.quantity) {
        throw new ConflictException(
          `Only ${product.stock.quantity} units of ${product.name} available in stock`
        );
      }

      // Check if the product already exists in the cart
      const existingCartItem = await CartItem.findOne({
        where: { cart_id: data.cart_id, product_id: data.product_id },
        transaction,
      });

      if (existingCartItem) {
        throw new ConflictException(
          "Product already exists in the cart. Consider updating the quantity instead."
        );
      }

      // clear cache if available
      await this.clearCache(data.cart_id);

      // Store data in cart item table
      return await CartItem.create(data, { transaction });
    });
  }

  async getUserCurrentCart(userId, transaction) {
    // Check if there is a cart with user_id = userId and is_current = true
    let cart = await Cart.findOne({
      where: { user_id: userId, is_current: true },
      transaction,
    });

    // If no current cart exists, create a new one
    if (!cart) {
      cart = await Cart.create(
        {
          user_id: userId,
        },
        { transaction }
      );
    }

    return cart;
  }

  async getUserCart(userId, cartId) {
    let cart = await Cart.findOne({
      where: { id: cartId, user_id: userId, is_current: 1 },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              include: [
                {
                  model: Stock,
                  as: "stock",
                  attributes: ["cost_price"],
                },
              ],
            },
          ],
          attributes: {
            include: [
              [
                sequelize.literal(
                  "(SELECT `CartItem`.`quantity` * `stock`.`cost_price` FROM `cart_items` AS `CartItem` LEFT JOIN `products` AS `Product` ON `CartItem`.`product_id` = `Product`.`id` LEFT JOIN `stocks` AS `Stock` ON `Product`.`id` = `Stock`.`product_id` WHERE `CartItem`.`id` = `items`.`id`)"
                ),
                "price",
              ],
            ],
          },
        },
      ],
    });

    if (!cart) {
      throw new NotFoundException("Cart not found");
    }
    // create cache for faster checkout

    cart = new CartResource(cart).toJson();

    await this.redisService.set(CartService.CART_KEY + cartId, encrypt(cart));

    return cart;
  }

  async deleteItemFromCart(userId, cartId, productId) {
    return await sequelize.transaction(async (transaction) => {
      // Query Cart and CartItem together
      const cart = await Cart.findOne({
        where: { id: cartId, user_id: userId, is_current: 1 },
        include: {
          model: CartItem,
          as: "items",
          where: { product_id: productId, is_ordered: 0 },
          required: false,
        },
        transaction,
      });

      if (!cart) {
        throw new NotFoundException("Cart not found");
      }

      if (!cart.items || cart.items.length === 0) {
        throw new NotFoundException("Cart item not found");
      }

      // There should be only one CartItem with the given productId
      const cartItem = cart.items[0];

      await cartItem.destroy({ transaction });

      //clear cache if available
      await this.clearCache(cartId);

      return true;
    });
  }

  async clearUserCart(userId, cartId, transaction = null) {
    console.log("user id is " + userId + " and cartId is " + cartId);
    let options = {};
    if (transaction) {
      options.transaction = transaction;
    }

    return await sequelize.transaction(async (transaction) => {
      // Find the cart with the given ID and user ID
      const cart = await Cart.scope("withDates").findOne({
        where: { id: cartId, user_id: userId, is_current: 1 },
        include: { model: CartItem, as: "items" },
        transaction,
      });

      if (!cart) {
        throw new NotFoundException("Cart not found");
      }

      // Delete all associated cart items
      await sequelize.query(
        `UPDATE cart_items SET is_ordered = 1, deleted_at = NOW() WHERE cart_id = :cartId`,
        {
          replacements: { cartId },
          transaction,
        }
      );

      // Set the is_current column to 0 and update deleted_at timestamp manually
      await sequelize.query(
        `UPDATE carts SET is_current = 0, deleted_at = NOW() WHERE id = :cartId`,
        {
          replacements: { cartId },
          transaction,
        }
      );

      await this.clearCache(cartId);

      return true;
    }, options);
  }

  async updateItemQuantity(data, userId, cartId) {
    const { product_id, quantity } = data;

    return await sequelize.transaction(async (transaction) => {
      // Find the cart for the user that is currently active
      const cart = await Cart.findOne({
        where: { id: cartId, user_id: userId, is_current: 1 },
        transaction,
      });

      if (!cart) {
        throw new NotFoundException("Cart not found");
      }

      // Find the specific cart item with the given product_id
      const cartItem = await CartItem.findOne({
        where: { product_id, cart_id: cartId },
        transaction,
      });

      if (!cartItem) {
        throw new NotFoundException("Cart item not found");
      }

      // Check if the product exists and fetch its stock
      const product = await Product.findByPk(product_id, {
        include: [{ model: Stock, as: "stock" }],
        transaction,
      });

      if (!product) {
        throw new NotFoundException("Product not found");
      }

      // Check if the updated quantity is available in stock
      if (product.stock.quantity < quantity) {
        throw new ConflictException(
          `Only ${product.stock.quantity} units of ${product.name} available in stock`
        );
      }

      // Update the quantity of the cart item
      await cartItem.update({ quantity }, { transaction });

      // clear cache if available
      await this.clearCache(cartId);

      // Reload the cart item to include updated data
      return await cartItem.reload({
        transaction,
      });
    });
  }

  async getCartItemCount(userId, cartId) {
    const cart = await Cart.findOne({
      where: {
        id: cartId,
        user_id: userId,
        is_current: 1,
      },
      include: [
        {
          model: CartItem,
          as: "items",
          attributes: [],
        },
      ],
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("items.id")), "item_count"],
      ],
      group: ["Cart.id"],
    });

    if (!cart) {
      throw new NotFoundException("Cart not found");
    }

    return cart.get("item_count");
  }

  async clearCache(cart_id) {
    if (await this.redisService.get(CartService.CART_KEY + cart_id)) {
      await this.redisService.del(CartService.CART_KEY + cart_id);
    }
    return;
  }
}

module.exports = CartService;
