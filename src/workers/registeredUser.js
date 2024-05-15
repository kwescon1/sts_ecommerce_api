// RegisteredUser.js
const Queue = require("bull");
const emailService = require("../services/emailService");
const { redisConfig, registeredUserQueue } = require("../config/worker");
const logger = require("../config/logging");

class RegisteredUser {
  constructor(queueName) {
    this.queueName = queueName;
    this.queue = new Queue(queueName, redisConfig);
    this.setupListeners();
    this.initializeJobProcessing();
  }

  setupListeners() {
    this.queue.on("completed", (job, result) => {
      logger.info(
        `Job completed for queue ${this.queueName} with result ${result}`
      );
    });
    this.queue.on("failed", (job, err) => {
      logger.error(`Job failed for queue ${this.queueName} with error ${err}`);
    });
    this.queue.on("active", (job) => {
      logger.info(`Job ${job.id} in queue ${this.queueName} is active`);
    });
  }

  initializeJobProcessing() {
    this.queue.process(async (job) => {
      const { to, clientName } = job.data;
      try {
        await emailService.sendWelcomeEmail(to, clientName);
        logger.info(`Sent email to ${to} from queue ${this.queueName}`);
      } catch (error) {
        logger.error(
          `Error sending email from queue ${this.queueName} to ${to}: ${error}`
        );
      }
    });
  }

  enqueueWelcomeEmail(data) {
    this.queue.add(data);
    logger.info(`Enqueued welcome email to ${data.to}`);
  }
}

module.exports = new RegisteredUser(registeredUserQueue);
