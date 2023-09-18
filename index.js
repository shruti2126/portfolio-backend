/** @format */

const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8080;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/send-email", (req, res) => {
  const formData = req.body;
  // Compose email message
  const mailOptions = {
    from: `${formData.email}`,
    to: "ss.sharma1826@gmail.com",
    subject: `New Contact Form Submission from ${formData.firstname} ${formData.lastname}`,
    text: `Name: ${formData.firstname} ${formData.lastname}\nEmail: ${formData.email}\nReason: ${formData.reason}\nMessage: ${formData.message}`,
  };
  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error sending email");
    } else {
      res.header("Access-Control-Allow-Origin", "true");
      res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
      res.setHeader("crossorigin", true);
      console.log("Email sent: " + info.response);
      res.status(200).send({ "Email sent successfully": formData });
    }
  });
});

app.listen(port, () => {
  console.log(`server running on ${port}`);
});

module.exports = app;
