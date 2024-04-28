const Post = require("../models/post");

exports.renderHomePage = (req, res) => {
  Post.find()
    .populate("userId", "username email")
    .sort({ createdAt: -1 })
    .then((posts) => {
      res.render("homepage", {
        title: "Home Page",
        postsArr: posts,
        isLogin: req.session.isLogin ? true : false,
      });
    })
    .catch((err) => console.log(err));
};

exports.renderCreatePage = (req, res) => {
  res.render("create-post", { title: "Create Post" });
};

exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;

  Post.create({ title, description, image_url: photo, userId: req.user })
    .then((_) => {
      console.log(`Post Created At ${req.user.username}`);
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.getPostDetails = (req, res) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .populate("userId", "username email")
    .then((post) => res.render("details", { title: post.title, post }))
    .catch((err) => console.log(err));
};

exports.deletePost = (req, res) => {
  const { postId } = req.params;
  Post.findByIdAndDelete(postId)
    .then((result) => {
      console.log("Post Deleted!");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.renderEditPage = (req, res) => {
  const { postId } = req.params;
  Post.findById(postId)
    .then((post) => res.render("edit-post", { title: "Edit Post", post }))
    .catch((err) => console.log(err));
};

exports.updatePost = (req, res) => {
  const { postId, title, description, photo } = req.body;

  Post.findByIdAndUpdate(postId, { title, description, image_url: photo })
    .then((_) => {
      console.log("Post Updated!");
      res.redirect(`/post/${postId}`);
    })
    .catch((err) => console.log(err));

  // Post.updateOne({ _id: postId }, { title, description, image_url: photo })
  //   .then((result) => {
  //     console.log("Post Updated!");
  //     res.redirect(`/post/${postId}`);
  //   })
  //   .catch((err) => console.log(err));
};
