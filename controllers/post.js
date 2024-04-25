const { where } = require("sequelize");
const Post = require("../models/post");

// ? Rendering Home Page and Displaying Posts
exports.renderHomePage = (req, res) => {
  Post.findAll({ order: [["createdAt", "DESC"]] })
    .then((posts) => {
      res.render("homepage", { title: "Home Page", postsArr: posts });
    })
    .catch((err) => console.log(err));
};

// ? Rendering Create Post Page ( UI )
exports.renderCreatePage = (req, res) => {
  res.render("create-post", { title: "Create Post" });
};

// ? Create a new Post
exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;
  // ? Association ( Special Method ) req.user.createPost => Post is a model name
  req.user
    .createPost({
      title,
      description,
      image_url: photo,
    })
    .then((_) => {
      console.log("New post created");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

// ? Getting Post Details
exports.getPostDetails = (req, res) => {
  const postId = req.params.postId;
  Post.findByPk(postId)
    .then((post) => {
      res.render("details", { title: post.title, post: post });
    })
    .catch((err) => console.log(err));

  // ? Another Way =>  Using findOne({where : {key : value }})
  // Post.findOne({ where: { id: postId } })
  //   .then((row) => {
  //     res.render("details", { title: row.title, post: row });
  //   })
  //   .catch((err) => console.log(err));
};

// ? Delete Post with Post Id
exports.deletePost = (req, res) => {
  const postId = req.params.postId;

  Post.findByPk(postId)
    .then((post) => {
      if (!post) {
        return res.redirect("/");
      }
      return post.destroy();
    })
    .then((_) => {
      console.log("Post deleted");
      res.redirect("/");
    })
    .catch((err) => console.log(err));

  // ? Another Way =>  Using destroy({where : {key : value }})
  // Post.destroy({ where: { id: postId } })
  //   .then((_) => {
  //     console.log("Post deleted");
  //     res.redirect("/");
  //   })
  //   .catch((err) => console.log(err));
};

// ? Rendering Edit Post Page
exports.renderEditPage = (req, res) => {
  const postId = req.params.postId;
  Post.findByPk(postId)
    .then((post) => {
      res.render("edit-post", { title: "Edit Post", post: post });
    })
    .catch((err) => console.log(err));
};

// ? Update Post
exports.updatePost = (req, res) => {
  const { id, title, description, photo } = req.body;
  Post.findByPk(id)
    .then((post) => {
      if (!post) {
        return res.redirect("/");
      }
      post.title = title;
      post.description = description;
      post.image_url = photo;
      return post.save();
    })
    .then((_) => {
      console.log("Post updated");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};
