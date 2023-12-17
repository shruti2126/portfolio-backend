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
    origin: ["http://localhost:3000", "https://shrutis.io"],
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
  const emailToClient = {
    from: `${formData.email}`,
    to: "shrutis0698@gmail.com",
    subject: `New Contact Form Submission from ${formData.firstname} ${formData.lastname}`,
    text: `Name: ${formData.firstname} ${formData.lastname}\nEmail: ${formData.email}\nReason: ${formData.reason}\nMessage: ${formData.message}`,
  };
  // Send the email
  transporter.sendMail(emailToClient, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error sending email");
    } else {
      res.status(200).send("Email sent successfully");
    }
  });

  //Create reply to client
  const replyToClient = {
    from: `shrutis0698@gmail.com`,
    to: `${formData.email}`,
    subject: `Responding to you request!`,
    text: `Dear ${formData.firstname}, 
    I am thrilled that you are interested in connecting with me! 
    Please respond with a suitable date time that you would like to
    meet. Looking forward to it!
    Best, 
    Shruti
  `,
  };

  //Email reply to client
  transporter.sendMail(replyToClient, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error replying to client");
    } else {
      res.status(200).send("Email sent to client successfully");
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
  res.sendStatus(200);
});

module.exports = app;
