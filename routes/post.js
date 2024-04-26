const express = require("express");
const router = express.Router();

const postController = require("../controllers/post");

router.get("/", postController.renderHomePage);

router.get("/post/:postId", postController.getPostDetails);

module.exports = router;
