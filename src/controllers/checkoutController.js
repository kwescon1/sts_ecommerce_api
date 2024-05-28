const logger = require("../config/logging");

class CheckoutController {
  /**
   * CheckoutController constructor.
   * Injects CheckoutService for handling the business logic.
   * @param {CheckoutService} checkoutService - The service for checkout operations.
   */
  constructor({ checkoutService }) {
    this.checkoutService = checkoutService;
  }

  /**
   * Handles the request to verify checkout details
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   */

  async checkoutSummary(req, res, userId) {
    const cartId = req.params.cart_id;

    const orderSummary = await this.checkoutService.orderSummary(
      cartId,
      userId
    );

    return res.success({ order_summary: orderSummary }, "Order Summary");
  }

  async checkoutOrder(req, res, userId) {
    const cartId = req.params.cart_id;
    const data = req.body;

    const checkout = await this.checkoutService.checkoutOrder(
      data,
      cartId,
      userId
    );

    return res.success(
      { client_secret: checkout },
      "User checkout in progress"
    );
  }

  async confirmOrder(req, res) {
    const data = req.body;

    // Confirm payment
    const { order, message } = await this.checkoutService.confirmPayment(data);

    return res.success({ order: order }, message);
  }
}

module.exports = CheckoutController;
