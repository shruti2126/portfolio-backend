/** @format */

const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const cors = require("cors");
// middleware
app.use(express.json());
app.use(express.urlencoded());

app.use(cors());

// Create a Nodemailer transporter with your email service credentials
const transporter = nodemailer.createTransport({
  service: "Gmail", // e.g., 'Gmail', 'SendGrid', etc.
  auth: {
    user: "ss.sharma1826@gmail.com",
    pass: "nwcncdcpegmtvbgk",
  },
});

// Define a POST route to handle form submissions
app.post("/send-email", (req, res) => {
  const formData = req.body;
  console.log("formData = ", formData);
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
      res.redirect("/success");
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});

app.get("/success", (req, res) => {
  res.send("<h1>Your message was successfully sent!</h1>");
});

app.get("/", (req, res) => {
  res.json("Hello !");
});

// Start the server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
