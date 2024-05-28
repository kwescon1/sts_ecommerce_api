const { Order, OrderItem, ShippingAddress, sequelize } = require("../models");
const { ORDER_STATUS } = require("../utilities/constants");

const {
  generate,
  extractUniqueOrderNumber,
} = require("../utilities/orderNumberGenerator");
const NotFoundException = require("../exceptions/notFoundException");
const ConflictException = require("../exceptions/conflictException");
// order has many transactions
class OrderService {
  constructor({ redisService }) {
    this.redisService = redisService;
    this.CACHE_KEY_UNIQUE_ORDER_NUMBER = "latest_order_number";
    this.CACHE_SECONDS = 60 * 60;
  }

  async createOrder(data) {
    // Validate data fields
    if (
      !data.user_id ||
      !data.total_charge ||
      !data.items ||
      data.items.length === 0
    ) {
      throw new ConflictException(
        "User ID, total charge, and at least one item are required."
      );
    }

    let transaction;
    try {
      // Start a transaction
      transaction = await sequelize.transaction();

      // Generate a unique order number
      const order_number = await this.generateOrderNumber(data.user_id);

      // Calculate total price
      const total_price = data.total_charge;

      // Create the order in the database within the transaction
      const order = await Order.create(
        {
          ...data,
          order_number,
          total_price,
        },
        { transaction }
      );

      // Create order items within the transaction
      const orderItemPromises = data.items.map((item) => {
        return OrderItem.create(
          {
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_order: item.price,
          },
          { transaction }
        );
      });

      // Wait for all order items to be created within the transaction
      await Promise.all(orderItemPromises);

      // Commit the transaction
      await transaction.commit();

      return order;
    } catch (error) {
      // Rollback the transaction if an error occurs
      if (transaction) {
        await transaction.rollback();
      }
      console.log(error.message + " in creating order data in db");
      await this.clearCache(this.CACHE_KEY_UNIQUE_ORDER_NUMBER);
    }
  }

  async storeShippingDetails(data, transaction) {
    const existingAddress = await ShippingAddress.findOne({
      where: {
        street_address: data.street_address,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        country: data.country,
        label: data.label,
        order_id: data.order_id,
        user_id: data.user_id,
      },
      transaction,
    });

    if (!existingAddress) {
      return await ShippingAddress.create(data, { transaction });
    } else {
      return existingAddress;
    }
  }

  async getLatestUserPendingOrder(userId, transaction) {
    return await Order.findOne({
      where: { user_id: userId, status: ORDER_STATUS.PENDING },
      paranoid: false,
      order: [["created_at", "DESC"]],
      transaction,
    });
  }

  async generateOrderNumber(userId) {
    // Check Redis for the latest Order Number
    let latestUniqueOrderNumber;

    try {
      latestUniqueOrderNumber = await this.latestUniqueOrderNumber(userId);
      console.log(
        "Latest unique Order number from Redis or DB:",
        latestUniqueOrderNumber
      );
    } catch (error) {
      await this.clearCache(this.CACHE_KEY_UNIQUE_ORDER_NUMBER);
    }

    // Generate the next order number
    let orderNumber = generate(latestUniqueOrderNumber);

    // Ensure the order number is unique
    while (await this.verifyOrderNumber(orderNumber)) {
      console.log(
        "Order number already exists, resetting cached unique order number:",
        orderNumber
      );
      await this.resetCachedUniqueOrderNumber(orderNumber);
      orderNumber = generate(latestUniqueOrderNumber);
    }

    // Store the latest order number in Redis
    await this.redisService.set(
      this.CACHE_KEY_UNIQUE_ORDER_NUMBER,
      extractUniqueOrderNumber(orderNumber),
      this.CACHE_SECONDS
    );

    console.log("Final generated order number:", orderNumber);
    return orderNumber;
  }

  async verifyOrderNumber(orderNumber) {
    console.log("Verifying if order number exists:", orderNumber);
    return await Order.findOne({
      paranoid: false,
      where: { order_number: orderNumber },
    });
  }

  async latestUniqueOrderNumber(userId) {
    // Try to get the latest Order number from Redis

    let latestUniqueOrderNumber = await this.redisService.get(
      this.CACHE_KEY_UNIQUE_ORDER_NUMBER
    );
    console.log(
      "Latest unique Order number from Redis:",
      latestUniqueOrderNumber
    );

    if (!latestUniqueOrderNumber) {
      // If not in cache, get it from the database
      const lastSavedUserOrder = await this.lastSavedUserOrder(userId);
      latestUniqueOrderNumber = lastSavedUserOrder
        ? extractUniqueOrderNumber(lastSavedUserOrder.order_number)
        : "00000"; // Default value if no order are found

      console.log(
        "Latest unique order number from DB:",
        latestUniqueOrderNumber
      );

      // Save the latest order number to Redis
      await this.redisService.set(
        this.CACHE_KEY_UNIQUE_ORDER_NUMBER,
        latestUniqueOrderNumber,
        this.CACHE_SECONDS
      );
    }

    return latestUniqueOrderNumber;
  }

  async lastSavedUserOrder(userId) {
    // Find the latest product including soft-deleted ones
    console.log("Finding the last saved user order.");
    return await Order.findOne({
      where: { user_id: userId, status: ORDER_STATUS.PENDING },
      paranoid: false,
      order: [["created_at", "DESC"]],
    });
  }

  async resetCachedUniqueOrderNumber(orderNumber) {
    console.log("Resetting cached unique order number to:", orderNumber);
    await this.redisService.set(
      this.CACHE_KEY_UNIQUE_ORDER_NUMBER,
      extractUniqueOrderNumber(orderNumber),
      this.CACHE_SECONDS
    );
  }

  async clearCache(key) {
    if (await this.redisService.get(key)) {
      await this.redisService.del(key);
    }
  }

  async updateOrderStatus(orderId, status, transaction = null) {
    let options = {};
    if (transaction) {
      options.transaction = transaction;
    }

    let order = await Order.findByPk(orderId, options);

    console.log("order is " + JSON.stringify(order));

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    console.log("statis is " + status);

    // Set the is_current column to 0 and update deleted_at timestamp manually
    await sequelize.query(
      `UPDATE orders SET status = :status WHERE id = :orderId`,
      {
        replacements: { status, orderId },
        transaction,
      }
    );

    return await Order.findByPk(orderId, options);
  }
}

module.exports = OrderService;
