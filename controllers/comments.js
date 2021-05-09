const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const db = require("../db");

module.exports.newComment = catchAsync(async (req, res, next) => {
  const { text, post_id, parent } = req.body;
  const { user_id, username } = req.user;

  const result = await db.query(
    `insert into comments (user_id, post_id, text, parent, time)
     values ($1, $2, $3, $4, now()) returning comment_id, user_id, text, parent,
      time at time zone 'utc' as time`,
    [user_id, post_id, text, parent]
  );

  const comment = { ...result.rows[0], username };

  res.status(200).json({ message: "Comment Submitted", comment });
});
