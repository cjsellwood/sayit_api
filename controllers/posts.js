const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const db = require("../db");

// Fetch all posts
module.exports.allPosts = catchAsync(async (req, res, next) => {
  const result = await db.query("select * from posts");
  const posts = result.rows;
  console.log(posts);
  res.status(200).json({ posts: posts });
});

// Create new post
module.exports.newPost = catchAsync(async (req, res, next) => {
  const { user_id } = req.user;
  const { topic, title, text } = req.body;

  // Check if topic exists and get id
  const result = await db.query("select topic_id from topics where name = $1", [
    topic,
  ]);
  
  // Send error if not a topic
  if (!result.rows.length) {
    return next(new ExpressError(400, "Topic does not exist"))
  }

  const topic_id = result.rows[0].topic_id

  // Insert into database
  const insert = await db.query(
    "insert into posts (user_id, topic_id, title, text, time) values ($1, $2, $3, $4, now())",
    [user_id, topic_id, title, text]
  );

  res.status(200).json({ message: "Post Submitted" });
});
