const logger = require("../config/logging");

class TransactionController {
  /**
   * TransactionController constructor.
   * Injects TransactionService for handling the business logic.
   * @param {TransactionService} transactionService - The service for checkout operations.
   */
  constructor({ transactionService }) {
    this.transactionService = transactionService;
  }
}

module.exports = TransactionController;
