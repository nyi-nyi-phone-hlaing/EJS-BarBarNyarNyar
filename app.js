// TODO: default package
const express = require("express");
const path = require("path");

// TODO: third-party package
const bodyParser = require("body-parser");

// TODO: local file import
const sequelize = require("./utils/database");
const Post = require("./models/post");
const User = require("./models/user");

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

// ? Middleware for user info in all routes
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// ? Routes
app.use("/admin", adminRoutes);
app.use(postRoutes);

// ? Relations between tables (Post and User)
Post.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Post);

// ? Start server
sequelize
  .sync({ force: false })
  .then((_) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: "admin",
        email: "codelab@admin.com",
        password: "admin",
      });
    }

    return user;
  })
  .then((user) => {
    app.listen(8000);
    console.log("database connected!");
  })
  .catch((err) => console.log(err));
