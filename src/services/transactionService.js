const { sequelize, Transaction } = require("../models");
const {
  generate,
  extractUniqueTransactionNumber,
} = require("../utilities/transactionNumberGenerator");
const NotFoundException = require("../exceptions/notFoundException");
const ApiException = require("../exceptions/apiException");
const ConflictException = require("../exceptions/conflictException");
const config = require("../config/config");
const { default: Stripe } = require("stripe");
const stripe = require("stripe")(config.stripe.secretKey);
const { TRANSACTION_STATUS } = require("../utilities/constants");

const CHARGE = {
  // based on stripe charges
  FEE_PERCENTAGE: 0.029, // 2.9%
  FLAT_FEE_CENTS: 30, // $0.30 in cents
};

class TransactionService {
  constructor({ redisService }) {
    this.redisService = redisService;
    this.CACHE_KEY_UNIQUE_TRANSACTION_NUMBER = "latest_transaction_number";
    this.CACHE_SECONDS = 60 * 60;
  }

  static TRANSACTION_FEE_PERCENTAGE = CHARGE.FEE_PERCENTAGE;
  static TRANSACTION_FLAT_FEE = CHARGE.FLAT_FEE_CENTS;
  // Static methods to calculate charges
  static calculateStripeFee(amountInCents) {
    const percentageFee = Math.round(
      amountInCents * this.TRANSACTION_FEE_PERCENTAGE
    );
    return percentageFee + this.TRANSACTION_FLAT_FEE;
  }

  static calculateTotalCharge(amountInCents) {
    const stripeFee = TransactionService.calculateStripeFee(amountInCents);
    return amountInCents + stripeFee;
  }
  // based on stripe
  async calculateTransactionCharge(amount) {
    // stripe fee
    const fee = TransactionService.calculateStripeFee(amount);

    return fee;
  }

  async generateTransactionNumber() {
    // Check Redis for the latest Transaction Number
    let latestUniqueTransactionNumber;

    try {
      latestUniqueTransactionNumber =
        await this.latestUniqueTransactionNumber();
    } catch (error) {
      await this.clearCache(this.CACHE_KEY_UNIQUE_TRANSACTION_NUMBER);
    }

    // Generate the next transaction number
    let transactionNumber = generate(latestUniqueTransactionNumber);

    // Ensure the transaction number is unique
    while (await this.verifyTransactionNumber(transactionNumber)) {
      console.log(
        "Transaction number already exists, resetting cached unique transaction number:",
        transactionNumber
      );
      await this.resetCachedUniqueTransactionNumber(transactionNumber);
      transactionNumber = generate(latestUniqueTransactionNumber);
    }

    // Store the latest transaction number in Redis
    await this.redisService.set(
      this.CACHE_KEY_UNIQUE_TRANSACTION_NUMBER,
      extractUniqueTransactionNumber(transactionNumber),
      this.CACHE_SECONDS
    );

    console.log("Final generated transaction number:", transactionNumber);
    return transactionNumber;
  }

  async verifyTransactionNumber(transactionNumber) {
    console.log("Verifying if transaction number exists:", transactionNumber);
    return await Transaction.findOne({
      paranoid: false,
      where: { transaction_number: transactionNumber },
    });
  }

  async latestUniqueTransactionNumber() {
    // Try to get the latest Transaction number from Redis

    let latestUniqueTransactionNumber = await this.redisService.get(
      this.CACHE_KEY_UNIQUE_TRANSACTION_NUMBER
    );
    console.log(
      "Latest unique Transaction number from Redis:",
      latestUniqueTransactionNumber
    );

    if (!latestUniqueTransactionNumber) {
      // If not in cache, get it from the database

      const lastSavedTransaction = await this.lastSavedTransaction();
      latestUniqueTransactionNumber = lastSavedTransaction
        ? extractUniqueTransactionNumber(
            lastSavedTransaction.transaction_number
          )
        : "00000"; // Default value if no transaction are found

      // Save the latest transaction number to Redis
      await this.redisService.set(
        this.CACHE_KEY_UNIQUE_TRANSACTION_NUMBER,
        latestUniqueTransactionNumber,
        this.CACHE_SECONDS
      );
    }

    return latestUniqueTransactionNumber;
  }

  async lastSavedTransaction() {
    // Find the latest product including soft-deleted ones
    console.log("Finding the last saved  transaction.");
    return await Transaction.findOne({
      paranoid: false,
      order: [["created_at", "DESC"]],
    });
  }

  async resetCachedUniqueTransactionNumber(transactionNumber) {
    console.log(
      "Resetting cached unique transaction number to:",
      transactionNumber
    );
    await this.redisService.set(
      this.CACHE_KEY_UNIQUE_TRANSACTION_NUMBER,
      extractUniqueTransactionNumber(transactionNumber),
      this.CACHE_SECONDS
    );
  }

  async clearCache(key) {
    if (await this.redisService.get(key)) {
      await this.redisService.del(key);
    }
  }

  async generateTransaction(data, transaction) {
    try {
      data.transaction_number = await this.generateTransactionNumber();
      return await Transaction.create(data, { transaction });
    } catch (error) {
      await this.clearCache(this.CACHE_KEY_UNIQUE_TRANSACTION_NUMBER);
      throw new ConflictException("Error generating transaction ");
    }
  }

  async checkout(transactionData) {
    // Create transaction intent
    return await this.createPaymentIntent(transactionData);
  }

  // stripe
  async createPaymentIntent(data) {
    console.log("data is ");
    console.log(data);
    // Convert total to cents and ensure it's an integer
    const amount = Math.round(data.total * 100);
    const currency = "usd"; // Currency should be in lowercase

    const metadata = {
      transaction_id: data.id,
      status: data.status,
      transaction_date: data.transaction_date,
      cart_id: data.cart_id,
      user_id: data.user_id,
      order_id: data.order_id,
      transaction_number: data.transaction_number,
    };

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        metadata,
      });

      return paymentIntent.client_secret;
    } catch (error) {
      console.error(error);

      throw new ApiException(
        "Failed to create payment intent",
        error.statusCode
      );
    }
  }

  async verifyPayment(paymentId) {
    try {
      return await stripe.paymentIntents.retrieve(paymentId);
    } catch (error) {
      console.error("Error in verifying payment:", error);
      throw new ApiException("Failed to verify payment", error.statusCode);
    }
  }

  async updateTransactionStatus(
    transactionId,
    status,
    sequelizeTransaction = null
  ) {
    let options = {};
    if (sequelizeTransaction) {
      options.transaction = sequelizeTransaction;
    }

    console.log("Looking for transaction with ID " + transactionId);

    let transaction = await Transaction.findByPk(transactionId, options);

    if (!transaction) {
      throw new NotFoundException("Transaction not found");
    }

    await Transaction.update(
      { status },
      {
        where: { id: transactionId },
        transaction: sequelizeTransaction,
      }
    );

    // Reload the transaction to get the latest data
    transaction = await Transaction.findByPk(transactionId, options);

    console.log("letest transaction is " + JSON.stringify(transaction));

    return transaction;
  }

  async getTransaction(userId, transactionId, t) {
    const transaction = await Transaction.findOne({
      where: { user_id: userId, id: transactionId },
      transaction: t,
    });

    if (!transaction) {
      throw new NotFoundException("Transaction not found");
    }

    return transaction;
  }
}

module.exports = TransactionService;
