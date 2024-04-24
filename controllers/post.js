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

  Post.create({
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
