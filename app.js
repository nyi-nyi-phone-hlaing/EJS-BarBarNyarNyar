// default
const express = require("express");
const path = require("path");

// third-party package
const bodyParser = require("body-parser");

//? local import
const mongodbConnector = require("./utils/database");

const app = express();

// templating engine
app.set("view engine", "ejs");
app.set("views", "views");

// router import
const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/post", (req, res, next) => {
  console.log("I'm post middleware ");
  next();
});

app.use((req, res, next) => {
  console.log("I'm parent middleware ");
  next();
});

app.use("/admin", (req, res, next) => {
  console.log("I'm admin middleware");
  next();
});

app.use("/admin", adminRoutes);
app.use(postRoutes);

mongodbConnector();
app.listen(8000);
