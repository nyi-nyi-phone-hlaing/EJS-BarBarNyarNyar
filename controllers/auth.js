const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;
//? Rendering Login Page
exports.getLoginPage = (req, res) => {
  res.render("auth/login", { title: "Login" });
};

//? Handle Login
exports.loginAccount = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }
      return bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
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
  res.render("auth/register", { title: "Register" });
};

//? Handle Register
exports.registerAccount = (req, res) => {
  const { username, email, password } = req.body;

  User.findOne({ $or: [{ email }, { username }] })
    .then((user) => {
      if (user) {
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
          console.log("Register Successfully");
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
