const express = require("express");
const router = express.Router();
const passport = require("passport");
const comments = require("../controllers/comments");
const { validateNewComment } = require("../middleware");

router.post(
  "/new",
  validateNewComment,
  passport.authenticate("jwt", { session: false }),
  comments.newComment
);

module.exports = router;
