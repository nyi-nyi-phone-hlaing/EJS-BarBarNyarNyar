const express = require("express");
const path = require("path");

const router = express.Router();

const posts = [];

// GET -> /admin/create-post
router.get("/create-post", (req, res) => {
  res.render("create-post", { title: "Create Post" });
});

router.post("/", (req, res) => {
  const { title, description } = req.body;
  posts.push({
    title,
    description,
  });
  res.redirect("/");
});

module.exports = { adminRoutes: router, posts };
