const express = require("express");
const router = express.Router();

const postController = require("../controllers/post");

const {
  validatePostTitle,
  validatePostDescription,
  validatePostPhoto,
} = require("../utils/validation");

//? GET -> /admin/create-post
router.get("/create-post", postController.renderCreatePage);

//? POST -> /admin
router.post(
  "/",
  validatePostTitle("title"),
  validatePostPhoto("photo"),
  validatePostDescription("description"),
  postController.createPost
);

//? POST -> /admin/post/delete/{ID}
router.post("/post/delete/:postId", postController.deletePost);

//? GET -> /admin/post/edit/{ID}
router.get("/post/edit/:postId", postController.renderEditPage);

//? POST -> /admin/post/edit
router.post(
  "/post/edit",
  validatePostTitle("title"),
  validatePostPhoto("photo"),
  validatePostDescription("description"),
  postController.updatePost
);

module.exports = router;
