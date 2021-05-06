const express = require("express");
const router = express.Router();
const passport = require("passport");
const posts = require("../controllers/posts");
const { validateNewPost } = require("../middleware");

router.get("/", posts.allPosts);

router.post(
  "/new",
  validateNewPost,
  passport.authenticate("jwt", { session: false }),
  posts.newPost
);

module.exports = router;
