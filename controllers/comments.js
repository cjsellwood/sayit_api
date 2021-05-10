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

module.exports.deleteComment = catchAsync(async(req, res, next) => {
  const {user_id} = req.user;
  const {comment_id} = req.body;

  const result = await db.query(`update comments set text = '[deleted]', user_id = 11
  where comment_id = $1 and user_id = $2`, [comment_id, user_id])

  res.status(200).json({message: "Comment deleted"})
})