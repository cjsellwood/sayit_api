const express = require("express");
const router = express.Router();
const posts = require("../controllers/posts");
const { validateNewPost } = require("../middleware");

router.get("/", posts.allPosts);

router.get("/new", validateNewPost, posts.newPost);

module.exports = router;
