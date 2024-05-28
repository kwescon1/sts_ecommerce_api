const ConflictException = require("../exceptions/conflictException");
const ApiException = require("../exceptions/apiException");
const ValidationException = require("../exceptions/validationException");
const ORDER_SUMMARY_KEY = "ORDER-";
const { encrypt, decrypt } = require("../utilities/utils");
const { sequelize, Transaction } = require("../models");
const { TRANSACTION_STATUS, ORDER_STATUS } = require("../utilities/constants");

/**
 * Represents the service for managing user checkouts.
 * Encapsulates the business logic for checkout operations.
 */
class CheckoutService {
  constructor({
    redisService,
    cartService,
    transactionService,
    profileService,
    orderService,
    stockService,
  }) {
    this.redisService = redisService;
    this.cartService = cartService;
    this.transactionService = transactionService;
    this.profileService = profileService;
    this.orderService = orderService;
    this.stockService = stockService;
  }

  static ORDER_SUMMARY_CACHE_KEY = ORDER_SUMMARY_KEY;
  async orderSummary(cartId, userId) {
    // Check if there is a cached cart available
    //the cached key constant is failing to work
    let data = await this.redisService.get(this.cartService.CART_KEY + cartId);

    if (!data) {
      data = await this.cartService.getUserCart(userId, cartId);
    } else {
      data = decrypt(data);
    }

    const subTotal = data?.sub_total;

    if (!subTotal) {
      throw new ValidationException("Invalid cart data.");
    }

    // Calculate the transaction charge in cents (atomic value)
    const charge = await this.transactionService.calculateTransactionCharge(
      subTotal * 100
    );

    console.log("charge is" + charge);

    // Calculate the total charge in cents (atomic value)
    let totalCharge = subTotal * 100 + charge;

    console.log("total charge is" + totalCharge);

    // Convert amounts back to readable values (actual value) with proper rounding
    const chargedAmount = parseFloat((charge / 100).toFixed(2));
    totalCharge = parseFloat((totalCharge / 100).toFixed(2));

    console.log("charged amount charge is" + chargedAmount);
    console.log("total charge is" + totalCharge);

    let userAddress;

    try {
      userAddress = await this.profileService.getAddress(userId);
    } catch (error) {
      userAddress = null;
    }
    data.charge = chargedAmount;
    data.total_charge = totalCharge;
    data.user_address = userAddress;

    await this.redisService.set(
      CheckoutService.ORDER_SUMMARY_CACHE_KEY + cartId,
      encrypt(data)
    );

    //create pending order
    await this.orderService.createOrder(data);

    return {
      data,
    };
  }

  async checkoutOrder(data, cartId, userId) {
    return await sequelize.transaction(async (transaction) => {
      // Retrieve order summary from cache
      let orderSummary = decrypt(
        await this.redisService.get(
          CheckoutService.ORDER_SUMMARY_CACHE_KEY + cartId
        )
      );

      if (!orderSummary) {
        throw new ConflictException("Order summary not found");
      }

      // Determine shipping data
      let shippingData;
      if (data?.billing_is_shipping) {
        shippingData = { ...orderSummary.user_address };
      } else {
        shippingData = {
          street_address: data?.street_address,
          city: data?.city,
          state: data?.state,
          postal_code: data?.postal_code,
          country: data?.country,
          label: "Shipping",
        };
      }

      // Get latest pending user order
      const userOrder = await this.orderService.getLatestUserPendingOrder(
        userId,
        transaction
      );

      if (!userOrder) {
        throw new ConflictException("User order not found");
      }

      // Store shipping details
      shippingData.user_id = userId;
      shippingData.order_id = userOrder.id;

      const shippingDetails = await this.orderService.storeShippingDetails(
        shippingData,
        transaction
      );

      // Prepare transaction details
      const transactionDetails = {
        user_id: userId,
        order_id: userOrder.id,
        amount: orderSummary.sub_total,
        total: orderSummary.total_charge,
        charge: orderSummary.charge,
      };

      // Create transaction
      const orderTransaction =
        await this.transactionService.generateTransaction(
          transactionDetails,
          transaction
        );

      orderTransaction.cart_id = cartId;

      // Proceed with checkout
      return await this.transactionService.checkout(orderTransaction);
    });
  }

  async confirmPayment(data) {
    const t = await sequelize.transaction();
    try {
      // Verify payment
      const paymentIntent = await this.transactionService.verifyPayment(
        data.payment_id
      );

      let successfulPayment;

      if (paymentIntent.status === "succeeded") {
        successfulPayment = true;
      } else {
        successfulPayment = false;
      }
      successfulPayment = true;

      const transactionId = paymentIntent.metadata.transaction_id;
      const orderId = paymentIntent.metadata.order_id;
      const cartId = paymentIntent.metadata.cart_id;
      const userId = paymentIntent.metadata.user_id;

      console.log("Transaction ID from Stripe metadata is " + transactionId);

      if (!successfulPayment) {
        // Update transaction with failed status
        await this.transactionService.updateTransactionStatus(
          transactionId,
          TRANSACTION_STATUS.FAILED,
          t
        );
        return { order: null, message: "Transaction failed" };
      } else {
        console.log("The transaction status is COMPLETED");

        // Update transaction with completed status
        await this.transactionService.updateTransactionStatus(
          transactionId,
          TRANSACTION_STATUS.COMPLETED,
          t
        );

        // Update order status
        const order = await this.orderService.updateOrderStatus(
          orderId,
          ORDER_STATUS.CONFIRMED,
          t
        );

        console.log("The updated order status is " + JSON.stringify(order));

        // Delete cart cache
        await this.cartService.clearCache(cartId);

        // Delete order cache and perform stock operations if needed
        const orderSummaryCacheKey =
          CheckoutService.ORDER_SUMMARY_CACHE_KEY + cartId;
        const cachedOrderSummary = await this.redisService.get(
          orderSummaryCacheKey
        );

        if (cachedOrderSummary) {
          const items = decrypt(cachedOrderSummary).items;

          for (const item of items) {
            await this.stockService.updateStock(
              item.product_id,
              item.quantity,
              t
            );
          }

          await this.redisService.del(orderSummaryCacheKey);
        }

        // Clear user cart
        await this.cartService.clearUserCart(userId, cartId, t);

        await t.commit();
        return { order, message: "Successful transaction" };
      }
    } catch (error) {
      await t.rollback();
      console.error("Error confirming payment:", error);
      throw new ApiException("Failed to confirm payment");
    }
  }
}

module.exports = CheckoutService;
