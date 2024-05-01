//? default
const express = require("express");
const path = require("path");

//? third-party package
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

//? local import
const User = require("./models/user");
const { isLoginUser } = require("./middleware/middleware");

//? Creating express app
const app = express();

//? templating engine
app.set("view engine", "ejs");
app.set("views", "views");

//? router import
const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const { userInfo } = require("os");

//? Creating mongodb store
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

//? CSRF protection
const csrfProtect = csrf();

//? Custom middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(csrfProtect);
app.use(flash());

//? Middleware
app.use((req, res, next) => {
  let fakeInfo = {
    _id: "",
    username: "",
    email: "",
  };
  res.locals.isLogin = req.session.isLogin ? true : false;
  res.locals.csrfToken = req.csrfToken();
  res.locals.userInfo = req.session.userInfo ? req.session.userInfo : fakeInfo;
  next();
});

app.use((req, res, next) => {
  if (req.session.isLogin === undefined) {
    return next();
  }
  User.findById(req.session.userInfo._id)
    .select("_id username email")
    .then((user) => {
      req.user = user;
      next();
    });
});

//? Routes define
app.use("/admin", isLoginUser, adminRoutes);
app.use(authRoutes);
app.use(postRoutes);

//? mongodb connect
mongoose
  .connect(process.env.MONGODB_URL)
  .then((_) => {
    console.log("Connected to MongoDB");
    app.listen(8000);
  })
  .catch((err) => console.log(err));
