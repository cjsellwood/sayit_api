const express = require("express");
const router = express.Router();
const posts = require("../controllers/posts");
const { validateNewPost, validateNewTopic } = require("../middleware");

router.get("/", posts.allPosts);

router.post("/new", validateNewPost, posts.newPost);

router.post("/createtopic", validateNewTopic, posts.newTopic)

module.exports = router;
