exports.getLoginPage = (req, res) => {
  res.render("auth/login", { title: "Login" });
};

exports.loginAccount = (req, res) => {
  console.log(req.body);
  req.session.isLogin = true;
  res.redirect("/");
};

exports.getRegisterPage = (req, res) => {
  res.render("auth/register", { title: "Register" });
};

exports.registerAccount = (req, res) => {
  console.log(req.body);
  res.redirect("/auth/login");
  console.log("Register Successfully");
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
