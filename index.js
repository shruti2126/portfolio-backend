/** @format */

require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const dns = require("dns");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;

const insertIntoSignupQuery = require("./db/queries/POST/insertIntoSignup");
const getAllSignupQuery = require("./db/queries/GET/getAllSignup");

app.use(express.json());

app.use(
  cors({
    origins: ["http://localhost:3000", "https://shrutis.io"],
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type",
    credentials: true,
  })
);

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
      res
        .status(200)
        .send({ "Email sent successfully": info.response, formData });
    }
  });
});
const commonMisspellings = {
  "gamil.com": "gmail.com",
  "gmai.com": "gmail.com",
  "hotamil.com": "hotmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "outlok.com": "outlook.com",
  "outloo.com": "outlook.com",
};

app.post("/addUser", async (req, res) => {
  const { email } = req.body;
  const domain = email.split("@")[1];

  // Check for common misspellings
  if (commonMisspellings[domain]) {
    res.status(400).json({
      error: `Did you mean ${email.split("@")[0]}@${
        commonMisspellings[domain]
      }?`,
    });
    return;
  }

  dns.resolve(domain, async (err) => {
    if (err) {
      res.status(400).json({ error: "The domain of the email is not valid" });
      return;
    }

    try {
      const result = await insertIntoSignupQuery(email);
      res.status(200).json(result);
    } catch (error) {
      // Assume error.message contains the appropriate error string
      res.status(500).json({ error: error.message });
    }
  });
});

app.get("/getUsers", async (req, res) => {
  try {
    const result = await getAllSignupQuery();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello! I am up and running! :))");
});

module.exports = app;
