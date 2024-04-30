const dotenv = require("dotenv").config();

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_SENDER,
    pass: process.env.MAIL_PASSWORD,
  },
});
exports.mailSendAfterRegister = (email, username) => {
  transporter.sendMail(
    {
      from: process.env.MAIL_SENDER,
      to: email,
      subject: "Register Successfully",
      text: `Dear ${username} ,\n\nThank you for registering on our website. Your registration was successful.\n\nBest regards,\nThe Website Team`,
      html: `<html>
                      <body>
                        <p style="color: cornflowerblue" >Dear ${username},</p>
                        <p>Thank you for registering on our website. Your registration was successful.</p>
                        <p>Best regards,<br>
                        <span style="color: cornflowerblue">Codelab Myanmar</span></p>
                      </body>
                    </html>`,
    },
    (err) => {
      console.log(err);
    }
  );
};
