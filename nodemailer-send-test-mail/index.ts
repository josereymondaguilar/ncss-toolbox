import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "jose.for.dev@gmail.com",
    pass: "123",
  },
});

// Define the email message
const mailOptions: nodemailer.SendMailOptions = {
  from: "jose.for.dev@gmail.com",
  to: "jose.for.dev@gmail.com",
  subject: "Test Email",
  text: "This is a test email.",
};

// Send the email
transporter
  .sendMail(mailOptions)
  .then((info) => {
    console.log("Email sent:", info);
  })
  .catch((error) => {
    console.error("Email sending failed:", error);
  });
