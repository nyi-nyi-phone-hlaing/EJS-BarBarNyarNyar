// TODO: default package
const express = require("express");
const path = require("path");

// TODO: third-party package
const bodyParser = require("body-parser");

// TODO: local file import
const sequelize = require("./utils/database");

// ? Create express server
const app = express();

// ?  Set view engine
app.set("view engine", "ejs");
app.set("views", "views");

// ? Routes
const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");

// ? Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

// ? Middleware for /post route
app.use("/post", (req, res, next) => {
  next();
});

// ? Middleware for all routes
app.use((req, res, next) => {
  next();
});

// ? Middleware for /admin route
app.use("/admin", (req, res, next) => {
  next();
});

// ? Routes
app.use("/admin", adminRoutes);
app.use(postRoutes);

// ? Start server
sequelize
  .sync()
  .then((_) => {
    console.log("database connected!");
    app.listen(8000);
  })
  .catch((err) => console.log(err));
