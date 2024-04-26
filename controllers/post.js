const Post = require("../models/post");

exports.renderHomePage = (req, res) => {
  Post.getAllPost()
    .then((posts) =>
      res.render("homepage", { title: "Home Page", postsArr: posts })
    )
    .catch((err) => console.log(err));
};

exports.renderCreatePage = (req, res) => {
  res.render("create-post", { title: "Create Post" });
};

exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;
  const post = new Post(title, description, photo);
  post
    .create()
    .then((result) => console.log("Post Created!"))
    .catch((err) => console.log(err));
  res.redirect("/");
};

exports.getPostDetails = (req, res) => {
  const postId = req.params.postId;
  Post.getPostById(postId)
    .then((post) => res.render("details", { title: post.title, post }))
    .catch((err) => console.log(err));
};

exports.deletePost = (req, res) => {
  const { postId } = req.params;
  console.log(postId);
  Post.deletePostById(postId)
    .then((result) => {
      console.log("Post Deleted!");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.renderEditPage = (req, res) => {
  const { postId } = req.params;
  Post.getPostById(postId)
    .then((post) => res.render("edit-post", { title: "Edit Post", post }))
    .catch((err) => console.log(err));
};

exports.updatePost = (req, res) => {
  const { postId, title, description, photo } = req.body;
  console.log(postId);
  const post = new Post(title, description, photo);
  post
    .updatePost(postId)
    .then((result) => {
      console.log("Post Updated!");
      res.redirect(`/post/${postId}`);
    })
    .catch((err) => console.log(err));
};
