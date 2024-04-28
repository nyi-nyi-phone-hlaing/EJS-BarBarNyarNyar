exports.getLoginPage = (req, res) => {
  const cookie = req.get("Cookie")
    ? req.get("Cookie").split("=")[1].trim() === "true"
    : false;
  res.render("auth/login", { title: "Login", isLogin: cookie });
};

exports.loginAccount = (req, res) => {
  console.log(req.body);
  res.setHeader("Set-Cookie", "isLogin=true");
  res.redirect("/");
};

exports.getRegisterPage = (req, res) => {
  const cookie = req.get("Cookie")
    ? req.get("Cookie").split("=")[1].trim() === "true"
    : false;
  res.render("auth/register", { title: "Register", isLogin: cookie });
};

exports.registerAccount = (req, res) => {
  console.log(req.body);
  res.redirect("/auth/login");
  console.log("Register Successfully");
};
