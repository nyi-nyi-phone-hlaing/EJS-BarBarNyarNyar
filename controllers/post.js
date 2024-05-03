const Post = require("../models/post");

const { validationResult } = require("express-validator");

const TimeAgo = require("javascript-time-ago");
const en = require("javascript-time-ago/locale/en");
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");
console.log(TimeAgo);

//? Rendering Home Page
exports.renderHomePage = (req, res, next) => {
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
    .catch((err) => {
      console.log(err);
      const error = new Error(" Something went wrong. Please try again. ");
      return next(error);
    });
};

//? Rendering Create Post Page
exports.renderCreatePage = (req, res) => {
  console.log(req.body);
  res.render("create-post", {
    title: "Create Post",
    errorMsg: null,
    oldFormData: { title: "", description: "", photo: "" },
  });
};

//? Handle Create Post
exports.createPost = (req, res, next) => {
  const { title, description, photo } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("create-post", {
      title: "Create Post",
      errorMsg: errors.array()[0].msg,
      oldFormData: { title, description, photo },
    });
  }
  Post.create({ title, description, image_url: photo, userId: req.user })
    .then((_) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(" Post could not be created. try again. ");
      return next(error);
    });
};

//? Handle Post Details
exports.getPostDetails = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .populate("userId", "username email")
    .then((post) => {
      res.render("details", {
        title: post.title,
        post,
        date: timeAgo.format(new Date(post.createdAt) - 60 * 1000, "round"),
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Post not found with this id.");
      return next(error);
    });
};

//? Handle Delete Post
exports.deletePost = (req, res, next) => {
  const { postId } = req.params;
  Post.deleteOne({ _id: postId, userId: req.user._id })
    .then((_) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Post could not be deleted.");
      return next(error);
    });
};

//? Render Edit Page
exports.renderEditPage = (req, res, next) => {
  const { postId } = req.params;
  Post.findById(postId)
    .then((post) => {
      if (post.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      res.render("edit-post", {
        title: "Edit Post",
        post,
        oldFormData: {
          title: post.title,
          description: post.description,
          photo: post.image_url,
          postId: post._id,
        },
        isValidationFailed: false,
        errorMsg: null,
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Post not found with this id.");
      return next(error);
    });
};

//? Handle Update Post
exports.updatePost = (req, res, next) => {
  const { postId, title, description, photo } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("edit-post", {
      title: "Edit Post",
      errorMsg: errors.array()[0].msg,
      oldFormData: { title, description, photo, postId },
      isValidationFailed: true,
    });
  }

  Post.findById(postId)
    .then((post) => {
      if (post.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      post.title = title;
      post.description = description;
      post.image_url = photo;
      return post.save().then((_) => {
        res.redirect(`/post/${postId}`);
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Post could not be updated.");
      return next(error);
    });

  // Post.updateOne({ _id: postId }, { title, description, image_url: photo })
  //   .then((result) => {
  //     console.log("Post Updated!");
  //     res.redirect(`/post/${postId}`);
  //   })
  //   .catch((err) => console.log(err));
};
