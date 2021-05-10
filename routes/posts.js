const express = require("express");
const router = express.Router();
const passport = require("passport");
const posts = require("../controllers/posts");
const {
  validateNewPost,
  validateDeletePost,
  validateEditPost,
} = require("../middleware");

router.get("/", posts.allPosts);

router.get("/topics", posts.getTopics);

router.get("/topics/:topic", posts.topicPosts);

router.get("/:post_id", posts.singlePost);

router.post(
  "/new",
  validateNewPost,
  passport.authenticate("jwt", { session: false }),
  posts.newPost
);

router.delete(
  "/:post_id/delete",
  validateDeletePost,
  passport.authenticate("jwt", { session: false }),
  posts.deletePost
);

router.patch(
  "/:post_id/edit",
  validateEditPost,
  passport.authenticate("jwt", { session: false }),
  posts.editPost
);

module.exports = router;
