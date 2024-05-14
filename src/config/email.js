const nodemailer = require("nodemailer");
const config = require("./config");
const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: false, //true for port 465, false for others
  auth: {
    user: config.mail.username,
    pass: config.mail.password,
  },
});

module.exports = transporter;
