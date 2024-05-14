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
  // async sendMail(from, to, subject, text, html) {
  //   const mailOptions = {
  //     from, // sender address
  //     to, // list of receivers
  //     subject, // Subject line
  //     text, // plain text body
  //     html, // html body
  //   };

  //   try {
  //     const info = await this.transporter.sendMail(mailOptions);
  //     console.log("Message sent: %s", info.messageId);
  //     return info;
  //   } catch (error) {
  //     console.error("Error sending email:", error);
  //     throw error;
  //   }
  // }

  async sendWelcomeEmail(to, clientName) {
    const templatePath = path.join(
      __dirname,
      "../../public/views/welcome_email.hbs"
    );
    const source = await readFileAsync(templatePath, "utf8");
    const template = Handlebars.compile(source);
    const currentYear = new Date().getFullYear();
    const companyName = config.app.name;

    const htmlToSend = template({
      clientName,
      companyName,
      currentYear,
    });

    const mailOptions = {
      from: config.mail.fromAddress,
      to: to,
      subject: `Welcome to ${companyName}!`,
      html: htmlToSend,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.log("Error in sending email");
      logger.error(JSON.stringify(error));
    }
  }
}

module.exports = new EmailService();
