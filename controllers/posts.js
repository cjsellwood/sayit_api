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
  const { topic_id, title, text } = req.body;

  // Insert into database
  await db.query(
    "insert into posts (user_id, topic_id, title, text, time) values ($1, $2, $3, $4, now()",
    [user_id, topic_id, title, text]
  );

  res.status(200).json({ message: "Post Submitted" });
});

// Create new topic
module.exports.newTopic = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;

  // Insert new topic into database if topic name unique
  try {
  await db.query(`insert into topics (name, description) values ($1, $2)`, [
    name,
    description,
  ]);
  } catch (err) {
    if (err.code === "23505") {
      return next(new ExpressError(400, "Topic already exists"));
    } else {
      return;
    }
  }

  res.status(200).json({ message: "Topic Created" });
});