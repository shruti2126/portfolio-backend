/** @format */
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error in nodemailer transporter configuration:", error);
  } else {
    console.log("Nodemailer transporter configuration successful:", success);
  }
});

const emailToSelf = ({ formData }) => {
  console.log("ENV FILE EMAIL USER = ", process.env.EMAIL_USER);
  console.log("form data email = ", formData.email);
  const email = {
    from: "shrutis0698@gmail.com",
    to: "shrutis0698@gmail.com",
    subject: `New Contact Form Submission from ${formData.firstname} ${formData.lastname}`,
    text: `Name: ${formData.firstname} ${formData.lastname}\nEmail: ${formData.email}\nReason: ${formData.reason}\nMessage: ${formData.message}`,
  };
  return email;
};

const contactFormReplyToUser = ({ to, firstname }) => {
  console.log("sending email to = ", to);
  const email = {
    from: `shrutis0698@gmail.com`,
    to: `${to}`,
    subject: `Responding to you request!`,
    text: `Dear ${firstname}, \n I am thrilled that you are interested in connecting with me!. Please respond with a suitable date time that you would like to meet. \n Looking forward to it! \n Best, \n Shruti`,
  };
  return email;
};

const blogSignupConfirmation = ({ to }) => {
  const email = {
    from: "shrutis0698@gmail.com",
    to: `${to}`,
    subject: "Thanks for Signing up!",
    text: `Hello friend! \n, Its an honor to know that you are interested in the \n
		blog I intend on publishing soon! \n
		See you soon!\n
		Best,\n
		Shruti`,
  };

  return email;
};

const sendEmail = async (props) => {
  const { formData } = props;
  console.log("form data email =", formData.email);

  try {
    const replyEmail = contactFormReplyToUser({
      to: `${formData.email}`,
      firstname: `${formData.firstname}`,
    });
    const selfEmail = emailToSelf({ formData });
    transporter.sendMail(replyEmail, (error, info) => {
      if (error) {
        console.log("Error sending reply email:", error);
      } else {
        console.log("Reply email sent:", info.response);
      }
    });
    transporter.sendMail(selfEmail, (error, info) => {
      if (error) {
        console.log("Error sending self email:", error);
      } else {
        console.log("Self email sent:", info.response);
      }
    });
    return "success";
  } catch (error) {
    console.log("Error in sendEmail function:", error);
    return error;
  }
};

module.exports = sendEmail;
