const User = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const {
  mailSendAfterRegister,
  mailSendResetLink,
  mailSendResetSuccess,
} = require("../utils/mail");

const saltRounds = 10;
//? Rendering Login Page
exports.getLoginPage = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", { title: "Login", errorMsg: message });
};

//? Handle Login
exports.loginAccount = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }
      return bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
          req.flash("error", "Invalid email or password");
          return res.redirect("/login");
        }
        req.session.isLogin = true;
        req.session.userInfo = user;
        req.session.save((err) => {
          res.redirect("/");
          if (err) {
            console.log(err);
          }
        });
      });
    })
    .catch((err) => console.log(err));
};

//? Rendering Register Page
exports.getRegisterPage = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/register", { title: "Register", errorMsg: message });
};

//? Handle Register
exports.registerAccount = (req, res) => {
  const { username, email, password } = req.body;

  User.findOne({ $or: [{ email }, { username }] })
    .then((user) => {
      if (user) {
        if (user.username === username) {
          req.flash("error", "Username is already taken");
        }
        if (user.email === email) {
          req.flash("error", "Email is already taken");
        }
        return res.redirect("/register");
      }
      return bcrypt
        .hash(password, saltRounds)
        .then((hashedPassword) => {
          return User.create({
            username,
            email,
            password: hashedPassword,
          });
        })
        .then((_) => {
          res.redirect("/login");
          mailSendAfterRegister(email, username);
        });
    })
    .catch((err) => console.log(err));
};

//? Handle Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

//? Render Feedback Page
exports.getFeedbackPage = (req, res) => {
  res.render("feedback", { title: "Feedback" });
};

//? Rendering Reset Password
exports.getResetPage = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset-password", {
    title: "Reset Password",
    errorMsg: message,
  });
};

exports.resetLinkSend = (req, res) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) return res.redirect("/reset-password");
    const token = buffer.toString("hex");
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash("error", "Email does not exist in our record.");
          return res.redirect("/reset-password");
        }
        user.resetToken = token;
        user.tokenExp = Date.now() + 180000;
        return user.save().then((_) => {
          res.redirect("/feedback");
          mailSendResetLink(email, token);
        });
      })
      .catch((err) => console.log(err));
  });
};

//? Render Reset Form
exports.getResetForm = (req, res) => {
  const { token } = req.params;
  User.findOne({ resetToken: token, tokenExp: { $gt: Date.now() } }).then(
    (user) => {
      if (user) {
        let message = req.flash("error");
        if (message.length > 0) {
          message = message[0];
        } else {
          message = null;
        }
        res.render("auth/reset-form", {
          title: "Reset Password",
          errorMsg: message,
          user_id: user._id,
          token,
        });
      } else {
        res.redirect("/");
      }
    }
  );
};

exports.changeNewPassword = (req, res) => {
  const { password, confirmPassword, token, user_id } = req.body;
  let resetUser;
  User.findOne({
    resetToken: token,
    tokenExp: { $gt: Date.now() },
    _id: user_id,
  })
    .then((user) => {
      if (password === confirmPassword) {
        resetUser = user;
        return bcrypt.hash(password, saltRounds);
      }
      req.flash("error", "Password does not match");
      return res.redirect(`/reset-password/${token}`);
    })
    .then((hashedPassword) => {
      if (resetUser !== undefined) {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.tokenExp = undefined;
        return resetUser.save().then((_) => {
          res.redirect("/login");
          mailSendResetSuccess(resetUser.email, resetUser.username);
        });
      }
    })

    .catch((err) => console.log(err));
};
