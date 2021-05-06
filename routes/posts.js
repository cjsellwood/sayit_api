const express = require("express");
const router = express.Router();
const passport = require("passport");
const posts = require("../controllers/posts");
const { validateNewPost, validateNewTopic } = require("../middleware");

router.get("/", posts.allPosts);

router.post(
  "/new",
  validateNewPost,
  passport.authenticate("jwt", { session: false }),
  posts.newPost
);

router.post(
  "/createtopic",
  validateNewTopic,
  passport.authenticate("jwt", { session: false }),
  posts.newTopic
);

module.exports = router;
