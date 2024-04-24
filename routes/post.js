const express = require("express");
const router = express.Router();

const postController = require("../controllers/post");

// ? Method : GET => Rendering Home Page
router.get("/", postController.renderHomePage);

// ? Method : GET => Getting Post Details with Post Id
router.get("/post-details/:postId", postController.getPostDetails);

module.exports = router;
