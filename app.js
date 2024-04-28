// default
const express = require("express");
const path = require("path");

// third-party package
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

//? local import
const User = require("./models/user");

const app = express();

// templating engine
app.set("view engine", "ejs");
app.set("views", "views");

// router import
const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

//? Middleware
app.use((req, res, next) => {
  User.findById("662dd13d32e256d30efa38c2").then((user) => {
    req.user = user;
    next();
  });
});

app.use("/admin", adminRoutes);
app.use(authRoutes);
app.use(postRoutes);

//? mongodb connect
mongoose
  .connect(process.env.MONGODB_URI)
  .then((_) => {
    return User.findOne().then((user) => {
      if (!user) {
        User.create({
          username: "codelab_mm",
          email: "codelabmm@gmail.com",
          password: "abcdefg",
        });
      }
      return user;
    });
  })
  .then((_) => {
    console.log("Connected to MongoDB");
    app.listen(8000);
  })
  .catch((err) => console.log(err));
