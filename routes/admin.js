const express = require("express");
const router = express.Router();

const postController = require("../controllers/post");

// ? Method : GET =>  Rendering Create Post Page ( )
router.get("/create-post", postController.renderCreatePage);

// ? Method : POST => Create a new Post
router.post("/", postController.createPost);

// ? Method : POST => Delete Post
router.post("/post/delete/:postId", postController.deletePost);

// ? Method : GET => Get old post data
router.get("/post/edit/:postId", postController.renderEditPage);

// ? Method : Post => Update Post
router.post("/post/edit", postController.updatePost);

module.exports = router;
