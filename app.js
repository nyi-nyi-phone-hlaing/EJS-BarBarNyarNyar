// default
const express = require("express");
const path = require("path");

// third-party package
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

//? local import

const app = express();

// templating engine
app.set("view engine", "ejs");
app.set("views", "views");

// router import
const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);
app.use(postRoutes);

//? mongodb connect
mongoose
  .connect(process.env.MONGODB_URI)
  .then((_) => {
    console.log("Connected to MongoDB");
    app.listen(8000);
  })
  .catch((err) => console.log(err));
