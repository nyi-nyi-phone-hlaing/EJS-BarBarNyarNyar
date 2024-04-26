const express = require("express");
const router = express.Router();

const postController = require("../controllers/post");

// GET -> /admin/create-post
router.get("/create-post", postController.renderCreatePage);

router.post("/", postController.createPost);

router.post("/post/delete/:postId", postController.deletePost);

router.get("/post/edit/:postId", postController.renderEditPage);

router.post("/post/edit", postController.updatePost);

module.exports = router;
