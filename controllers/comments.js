const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const db = require("../db");

module.exports.newComment = catchAsync(async (req, res, next) => {
  const { text, post_id } = req.body;
  const { user_id } = req.user;

  await db.query(
    `insert into comments (user_id, post_id, text, time) values ($1, $2, $3, now())`,
    [user_id, post_id, text]
  );

  res.status(200).json({ message: "Comment Submitted" });
});
