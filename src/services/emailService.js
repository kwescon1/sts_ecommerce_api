const transporter = require("../config/email");
const fs = require("fs");
const util = require("util");
const Handlebars = require("handlebars");
const config = require("../config/config");
const readFileAsync = util.promisify(fs.readFile);
const path = require("path");
const logger = require("../config/logging");

class EmailService {
  constructor() {
    this.transporter = transporter;
  }

  async sendEmail(
    to,
    subject,
    templateName = null,
    templateData = null,
    text = null
  ) {
    try {
      let htmlToSend;
      if (templateName) {
        const templatePath = path.join(
          __dirname,
          `../../public/views/${templateName}.hbs`
        );
        const source = await readFileAsync(templatePath, "utf8");
        const template = Handlebars.compile(source);
        htmlToSend = template(templateData);
      }

      const mailOptions = {
        from: config.mail.fromAddress,
        to,
        subject,
        text, // plain text body
        html: htmlToSend, // html body
      };

      await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.log("Error in sending email");
      logger.error(JSON.stringify(error));
    }
  }

  async sendWelcomeEmail(to, clientName) {
    const subject = `Welcome to ${config.app.name}!`;
    const templateData = {
      clientName,
      companyName: config.app.name,
      currentYear: new Date().getFullYear(),
    };
    await this.sendEmail(to, subject, "welcome_email", templateData);
  }

  async sendSuspensionEmail(to, clientName) {
    const subject = `Account Suspended - ${config.app.name}`;
    const templateData = {
      clientName,
      companyName: config.app.name,
    };
    await this.sendEmail(to, subject, "user_account_suspension", templateData);
  }

  async sendDeletionEmail(to, clientName) {
    const subject = `Account Deleted - ${config.app.name}`;
    const templateData = {
      clientName,
      companyName: config.app.name,
    };
    await this.sendEmail(to, subject, "user_account_deletion", templateData);
  }

  async suspensionRemoved(to, clientName) {
    const subject = `Suspension Removed - ${config.app.name}`;
    const templateData = {
      clientName,
      companyName: config.app.name,
    };
    await this.sendEmail(to, subject, "suspension_removal", templateData);
  }

  async sendSimpleEmail(to, subject, text) {
    await this.sendEmail(to, subject, null, null, text);
  }
}

module.exports = new EmailService();
