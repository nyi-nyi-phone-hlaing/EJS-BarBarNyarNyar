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

exports.mailSendResetLink = (email, token) => {
  transporter.sendMail(
    {
      from: process.env.MAIL_SENDER,
      to: email,
      subject: "Reset Password",
      html: `<html>
              <body>
                <h3>Hello,</h3>
                <p>We received a request to reset your password. Please click the link below to reset your password:</p>
                <a style="display : block; width: fit-content; background: cornflowerblue ; color: white ; padding: 5px 10px ; text-decoration: none" href="http://localhost:8000/reset-password/${token}">Reset Password</a>
                <p>If you didn't request this, you can safely ignore this email.</p>
                <p>Best regards,</p>
                <p style="color: cornflowerblue" >Codelab Myanmar</p>
              </body>
            </html>`,
    },
    (err) => {
      console.log(err);
    }
  );
};

exports.mailSendResetSuccess = (email, username) => {
  transporter.sendMail(
    {
      from: process.env.MAIL_SENDER,
      to: email,
      subject: "Password Reset Successfully",
      html: `<html>
              <body>
                <h3 style="color: cornflowerblue" >Hello ${username},</h3>
                <p>Password reset successfully. Please login with your new password. </p>
                <p>Best regards,</p>
                <p style="color: cornflowerblue" >Codelab Myanmar</p>
              </body>
            </html>`,
    },
    (err) => {
      console.log(err);
    }
  );
};
