const express = require("express");
const router = express.Router();
const passport = require("passport");
const comments = require("../controllers/comments");
const { validateNewComment, validateDeleteComment } = require("../middleware");

router.post(
  "/new",
  validateNewComment,
  passport.authenticate("jwt", { session: false }),
  comments.newComment
);

router.delete(
  "/:comment_id/delete",
  validateDeleteComment,
  passport.authenticate("jwt", { session: false }),
  comments.deleteComment
);

module.exports = router;
