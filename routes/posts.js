const express = require("express");
const router = express.Router();
const passport = require("passport");
const posts = require("../controllers/posts");
const { validateNewPost } = require("../middleware");

router.get("/", posts.allPosts);

router.get("/topic/:topic", posts.topicPosts);

router.get("/:post_id", posts.singlePost);

router.post(
  "/new",
  validateNewPost,
  passport.authenticate("jwt", { session: false }),
  posts.newPost
);

module.exports = router;
