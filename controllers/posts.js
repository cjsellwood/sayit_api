const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const db = require("../db");

// Fetch all posts
module.exports.allPosts = catchAsync(async (req, res, next) => {
  const result = await db.query(
    `select posts.post_id, posts.user_id, posts.topic_id, posts.title,
     posts.text, posts.time at time zone 'utc' as time,
     topics.name as topic, users.username from posts
     join topics on topics.topic_id = posts.topic_id
     join users on users.user_id = posts.user_id`
  );
  const posts = result.rows;

  res.status(200).json({ posts: posts });
});

// Fetch posts of a single topic
module.exports.topicPosts = catchAsync(async (req, res, next) => {
  const { topic } = req.params;

  const result = await db.query(
    `select posts.post_id, posts.user_id, posts.topic_id, posts.title,
     posts.text, posts.time at time zone 'utc' as time,
     topics.name as topic, users.username from posts
     join topics on topics.topic_id = posts.topic_id
     join users on users.user_id = posts.user_id
     where topics.name = $1`,
    [topic]
  );

  console.log(result);

  // Send error if not a topic
  if (!result.rows.length) {
    return next(
      new ExpressError(
        400,
        "Topic does not exist or there are no posts for topic"
      )
    );
  }

  const posts = result.rows;

  res.status(200).json({ posts: posts });
});

// Fetch a single post
module.exports.singlePost = catchAsync(async (req, res, next) => {
  const { post_id } = req.params;

  // Get post details
  const result = await db.query(
    `select posts.post_id, posts.user_id, posts.topic_id, posts.title,
     posts.text, posts.time at time zone 'utc' as time,
     topics.name as topic, users.username from posts
     join topics on topics.topic_id = posts.topic_id
     join users on users.user_id = posts.user_id
     where posts.post_id = $1`,
    [post_id]
  );

  // Send error if not a post_id
  if (!result.rows.length) {
    return next(new ExpressError(400, "Post does not exist"));
  }

  const post = result.rows[0];

  // Get comments for post
  const commentsResult = await db.query(
    `select comments.comment_id, comments.user_id, comments.text,
     comments.time at time zone 'utc' as time, users.username from
    comments join users on comments.user_id = users.user_id
     where comments.post_id = $1`,
    [post_id]
  );

  const comments = commentsResult.rows;

  res.status(200).json({ post, comments });
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
    return next(new ExpressError(400, "Topic does not exist"));
  }

  const topic_id = result.rows[0].topic_id;

  // Insert into database
  const insert = await db.query(
    `insert into posts (user_id, topic_id, title, text, time)
     values ($1, $2, $3, $4, now())`,
    [user_id, topic_id, title, text]
  );

  res.status(200).json({ message: "Post Submitted" });
});

// Get list of topics
module.exports.getTopics = catchAsync(async (req, res, next) => {
  const result = await db.query(
    `select topic_id, name, description from topics`
  );

  const topics = result.rows;

  res.status(200).json({ topics });
});
