const User = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const { validationResult } = require("express-validator");

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
  res.render("auth/login", {
    title: "Login",
    errorMsg: message,
    oldFormData: { email: "", password: "" },
  });
};

//? Handle Login
exports.loginAccount = (req, res, next) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      title: "Login",
      errorMsg: errors.array()[0].msg,
      oldFormData: { email, password },
    });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(422).render("auth/login", {
          title: "Login",
          errorMsg: "Invalid email or password",
          oldFormData: { email, password },
        });
      }
      return bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
          return res.status(422).render("auth/login", {
            title: "Login",
            errorMsg: "Invalid email or password",
            oldFormData: { email, password },
          });
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
    .catch((err) => {
      console.log(err);
      const error = new Error("Something went wrong. Please try again. ");
      return next(error);
    });
};

//? Rendering Register Page
exports.getRegisterPage = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/register", {
    title: "Register",
    errorMsg: message,
    oldFormData: { username: "", email: "", password: "" },
  });
};

//? Handle Register
exports.registerAccount = (req, res, next) => {
  const { username, email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/register", {
      title: "Register",
      errorMsg: errors.array()[0].msg,
      oldFormData: { username, email, password },
    });
  }

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
    .catch((err) => {
      console.log(err);
      const error = new Error("Something went wrong. Please try again. ");
      return next(error);
    });
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
    oldFormData: { email: "" },
  });
};

exports.resetLinkSend = (req, res, next) => {
  const email = req.body.email;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/reset-password", {
      title: "Reset Password",
      errorMsg: errors.array()[0].msg,
      oldFormData: { email },
    });
  }
  crypto.randomBytes(32, (err, buffer) => {
    if (err) return res.redirect("/reset-password");
    const token = buffer.toString("hex");
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.status(422).render("auth/reset-password", {
            title: "Reset Password",
            errorMsg: "No account exists with this email",
            oldFormData: { email },
          });
        }
        user.resetToken = token;
        user.tokenExp = Date.now() + 180000;
        return user.save().then((_) => {
          res.redirect("/feedback");
          mailSendResetLink(email, token);
        });
      })
      .catch((err) => {
        console.log(err);
        const error = new Error("Something went wrong. Please try again. ");
        return next(error);
      });
  });
};

//? Render Reset Form
exports.getResetForm = (req, res, next) => {
  const { token } = req.params;
  User.findOne({ resetToken: token, tokenExp: { $gt: Date.now() } })
    .then((user) => {
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
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Something went wrong. Please try again. ");
      return next(error);
    });
};

exports.changeNewPassword = (req, res, next) => {
  const { password, confirmPassword, token, user_id } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/reset-form", {
      title: "Reset Password",
      errorMsg: errors.array()[0].msg,
      user_id,
      token,
    });
  }
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
    .catch((err) => {
      console.log(err);
      const error = new Error("Something went wrong. Please try again. ");
      return next(error);
    });
};
