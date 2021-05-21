const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const db = require("../db");
const { setOrder, setFilter } = require("../utils/sqlParameters");

// Fetch all posts
module.exports.allPosts = catchAsync(async (req, res, next) => {
  const { user_id, order, filter } = req.query;

  const sqlOrder = setOrder(order);
  const sqlFilter = setFilter(filter);

  const result = await db.query(
    `select posts.post_id, posts.user_id, posts.topic_id, posts.title,
     posts.text, posts.time at time zone 'utc' as time,
     topics.name as topic, users.username,
     cast(coalesce((select sum(vote) from votes where posts.post_id = post_id), 0) as integer) as votes,
     (select vote from votes where posts.post_id = post_id and user_id = $1) as user_vote
     from posts
     join topics on topics.topic_id = posts.topic_id
     join users on users.user_id = posts.user_id
     where time > $2
     order by ${sqlOrder};`,
    [user_id, sqlFilter]
  );

  // console.log(result);

  const posts = result.rows;

  res.status(200).json({ posts: posts });
});

// Fetch posts of a single topic
module.exports.topicPosts = catchAsync(async (req, res, next) => {
  const { topic } = req.params;
  const { user_id } = req.query;

  const result = await db.query(
    `select posts.post_id, posts.user_id, posts.topic_id, posts.title,
     posts.text, posts.time at time zone 'utc' as time,
     topics.name as topic, users.username,
     cast(coalesce((select sum(vote) from votes where posts.post_id = post_id), 0) as integer) as votes,
     (select vote from votes where posts.post_id = post_id and user_id = $1) as user_vote
      from posts
     join topics on topics.topic_id = posts.topic_id
     join users on users.user_id = posts.user_id
     where topics.name = $2;`,
    [user_id, topic]
  );

  // Send error if not a topic
  if (!result.rows.length) {
    const topicExists = await db.query(
      `select name from topics where name = $1`,
      [topic]
    );

    if (topicExists.rows.length) {
      return next(new ExpressError(400, "There are no posts for this topic"));
    } else {
      return next(new ExpressError(400, "Topic does not exist"));
    }
  }

  const posts = result.rows;

  res.status(200).json({ posts: posts });
});

// Fetch a single post
module.exports.singlePost = catchAsync(async (req, res, next) => {
  const { post_id } = req.params;
  const { user_id } = req.query;

  // Get post details
  const result = await db.query(
    `select posts.post_id, posts.user_id, posts.topic_id, posts.title,
     posts.text, posts.time at time zone 'utc' as time,
     topics.name as topic, users.username,
     cast(coalesce((select sum(vote) from votes where posts.post_id = post_id), 0) as integer) as votes,
     (select vote from votes where posts.post_id = post_id and user_id = $1) as user_vote
    from posts
     join topics on topics.topic_id = posts.topic_id
     join users on users.user_id = posts.user_id
     where posts.post_id = $2`,
    [user_id, post_id]
  );

  // Send error if not a post_id
  if (!result.rows.length) {
    return next(new ExpressError(400, "Post does not exist"));
  }

  const post = result.rows[0];

  // Get comments for post
  const commentsResult = await db.query(
    `select comments.comment_id, comments.user_id, comments.text, comments.parent,
     comments.time at time zone 'utc' as time, users.username from
    comments join users on comments.user_id = users.user_id
     where comments.post_id = $1`,
    [post_id]
  );

  const comments = commentsResult.rows;

  res.status(200).json({ post, comments });
});

// Get list of topics
module.exports.getTopics = catchAsync(async (req, res, next) => {
  const result = await db.query(
    `select topic_id, name, description from topics`
  );

  const topics = result.rows;

  res.status(200).json({ topics });
});

// Get single topic
module.exports.getSingleTopic = catchAsync(async (req, res, next) => {
  const { topic } = req.body;

  const result = await db.query(
    `select topic_id, name, description from topics where name = $1`,
    [topic]
  );

  // Send error if not a topic
  if (!result.rows.length) {
    return next(new ExpressError(400, "Topic does not exist"));
  }

  const topicContent = result.rows[0];

  res.status(200).json({ topic: topicContent });
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
     values ($1, $2, $3, $4, now()) returning post_id`,
    [user_id, topic_id, title, text]
  );

  res
    .status(200)
    .json({ message: "Post Created", post_id: insert.rows[0].post_id });
});

// Delete post
module.exports.deletePost = catchAsync(async (req, res, next) => {
  const { user_id } = req.user;
  const { post_id } = req.body;

  await db.query(`delete from posts where post_id = $1 and user_id = $2`, [
    post_id,
    user_id,
  ]);

  res.status(200).json({ message: "Post Deleted" });
});

// Edit post
module.exports.editPost = catchAsync(async (req, res, next) => {
  const { user_id } = req.user;
  const { text, post_id } = req.body;

  await db.query(
    `update posts set text = $1 where post_id = $2 and user_id = $3`,
    [text, post_id, user_id]
  );

  res.status(200).json({ message: "Comment edited" });
});

// Get posts containing search query
module.exports.searchPosts = catchAsync(async (req, res, next) => {
  const { q, user_id } = req.query;

  const result = await db.query(
    `select posts.post_id, posts.user_id, posts.topic_id, posts.title,
     posts.text, posts.time at time zone 'utc' as time,
     topics.name as topic, users.username,
     cast(coalesce((select sum(vote) from votes where posts.post_id = post_id), 0) as integer) as votes,
     (select vote from votes where posts.post_id = post_id and user_id = $1) as user_vote
      from posts
     join topics on topics.topic_id = posts.topic_id
     join users on users.user_id = posts.user_id
     where posts.title ilike $2 or posts.text ilike $2`,
    [user_id, `%${q}%`]
  );

  // Send error if not a topic
  if (!result.rows.length) {
    return next(new ExpressError(400, "No posts found"));
  }

  const posts = result.rows;

  res.status(200).json({ posts: posts });
});

// Get posts from a specific user
module.exports.userPosts = catchAsync(async (req, res, next) => {
  const { username } = req.params;
  const { user_id } = req.query;

  const result = await db.query(
    `select posts.post_id, posts.user_id, posts.topic_id, posts.title,
     posts.text, posts.time at time zone 'utc' as time,
     topics.name as topic, users.username,
     cast(coalesce((select sum(vote) from votes where posts.post_id = post_id), 0) as integer) as votes,
     (select vote from votes where posts.post_id = post_id and user_id = $1) as user_vote
     from posts
     join topics on topics.topic_id = posts.topic_id
     join users on users.user_id = posts.user_id
     where users.username = $2`,
    [user_id, username]
  );

  // Send error if not a topic
  if (!result.rows.length) {
    return next(new ExpressError(400, "No posts found"));
  }

  const posts = result.rows;

  res.status(200).json({ posts: posts });
});

// Vote for a post
module.exports.votePost = catchAsync(async (req, res, next) => {
  const { vote, post_id } = req.body;
  const { user_id } = req.user;

  await db.query(
    `insert into votes (user_id, post_id, vote) values ($1, $2, $3)
    on conflict (user_id, post_id) do update set vote = $3`,
    [user_id, post_id, vote]
  );

  res.status(200).json({ message: "Voted" });
});
