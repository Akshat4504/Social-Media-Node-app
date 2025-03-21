const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: process.env.TEST_EMAIL,
        pass: process.env.TEST_PASS,
    },
});

module.exports = transporter;
