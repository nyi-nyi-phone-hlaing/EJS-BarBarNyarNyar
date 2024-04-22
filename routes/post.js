const express = require("express");
const router = express.Router();
const path = require("path");

const { posts } = require("./admin");

router.get("/", (req, res) => {
  console.log(posts);
  // res.sendFile(path.join(__dirname, "../views/homepage.html"));
  res.render("homepage", { title: "Home Page", postsArr: posts });
});

module.exports = router;
