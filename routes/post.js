const express = require("express");
const router = express.Router();

const postController = require("../controllers/post");

//? GET -> /
router.get("/", postController.renderHomePage);

//? GET -> /post/{ID}
router.get("/post/:postId", postController.getPostDetails);

module.exports = router;
