const logger = require("../config/logging");

class OrderController {
  /**
   * OrderController constructor.
   * Injects OrderService for handling the business logic.
   * @param {OrderService} orderService - The service for order operations.
   */
  constructor({ orderService }) {
    this.orderService = orderService;
  }
}

module.exports = OrderController;
