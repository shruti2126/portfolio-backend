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

const allowedOrigins = ["http://localhost:3000", "https://shrutis.io"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
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
  const emailToSelf = {
    from: `${formData.email}`,
    to: "shrutis0698@gmail.com",
    subject: `New Contact Form Submission from ${formData.firstname} ${formData.lastname}`,
    text: `Name: ${formData.firstname} ${formData.lastname}\nEmail: ${formData.email}\nReason: ${formData.reason}\nMessage: ${formData.message}`,
  };

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
  // Wrap sendMail in a Promise
  const sendEmailToClient = new Promise((resolve, reject) => {
    transporter.sendMail(emailToSelf, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });

  const sendReplyToClient = new Promise((resolve, reject) => {
    transporter.sendMail(replyToClient, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });

  // Handle both emails
  Promise.all([sendEmailToClient, sendReplyToClient])
    .then((results) => {
      res.status(200).send("Emails sent successfully");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error sending emails");
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

const { promisify } = require("util");
const dnsResolve = promisify(dns.resolve);

app.post("/addUser", async (req, res) => {
  const { email } = req.body;
  console.log("received = ", email);
  const domain = email.split("@")[1];
  try {
    // Check for common misspellings
    if (commonMisspellings[domain]) {
      return res.status(400).json({
        error: `Did you mean ${email.split("@")[0]}@${
          commonMisspellings[domain]
        }?`,
      });
    }
    await dnsResolve(domain);
    await insertIntoSignupQuery({ email });
    res.sendStatus(200);
  } catch (error) {
    if (error.code === "ENOTFOUND") {
      res.status(400).json({ error: "The domain of the email is not valid" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.get("/getUsers", async (req, res) => {
  try {
    const result = await getAllSignupQuery();
    console.log("all users result = ", result);
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
