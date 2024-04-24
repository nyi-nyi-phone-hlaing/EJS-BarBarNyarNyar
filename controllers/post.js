const posts = [];

const Post = require("../models/post");

exports.renderHomePage = (req, res) => {
  Post.getAllPost()
    .then(([rows]) => {
      res.render("homepage", { title: "Home Page", postsArr: rows });
    })
    .catch((err) => console.log(err));
};

exports.renderCreatePage = (req, res) => {
  res.render("create-post", { title: "Create Post" });
};

exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;

  const post = new Post(title, description, photo);
  post
    .setPost()
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.getPostDetails = (req, res) => {
  const postId = req.params.postId;
  Post.getOnePost(postId)
    .then(([row]) => {
      res.render("details", { title: row[0].title, post: row[0] });
    })
    .catch((err) => console.log(err));
};
