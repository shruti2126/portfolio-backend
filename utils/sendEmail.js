/** @format */
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const emailToSelf = ({ formData }) => {
  const email = {
    from: `${formData.email}`,
    to: "shrutis0698@gmail.com",
    subject: `New Contact Form Submission from ${formData.firstname} ${formData.lastname}`,
    text: `Name: ${formData.firstname} ${formData.lastname}\nEmail: ${formData.email}\nReason: ${formData.reason}\nMessage: ${formData.message}`,
  };
  return email;
};

const contactFormReplyToUser = ({ to, firstname }) => {
  const email = {
    from: `shrutis0698@gmail.com`,
    to: `${to}`,
    subject: `Responding to you request!`,
    text: `Dear ${firstname}, 
				I am thrilled that you are interested in connecting with me! 
				\n Please respond with a suitable date time that you would like to
				meet. \n Looking forward to it!
				Best, 
				Shruti
			`,
  };
  return email;
};

const blogSignupConfirmation = ({ to}) => {
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
  const { data } = props;
  const email = [];
  if (forBlog) {
    email.push(blogSignupConfirmation(`${data.email}`, `${data.firstname}`));
  } else {
    email.push([
      contactFormReplyToUser(`${data.email}`, `${data.firstname}`),
      emailToSelf({ data }),
    ]);
  }
  transporter.sendMail(email, (error, info) => {
    if (error) {
      return error;
    } else {
      return info;
    }
  });
};

module.exports = sendEmail;
