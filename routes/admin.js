const express = require("express");
const router = express.Router();

const postController = require("../controllers/post");

// ? Method : GET =>  Rendering Create Post Page ( )
router.get("/create-post", postController.renderCreatePage);

// ? Method : POST => Create a new Post
router.post("/", postController.createPost);

module.exports = router;
