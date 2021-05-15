// Connect to postgres database
const db = require("./db");
const bcrypt = require("bcrypt");

const seedDB = async () => {
  // Create test users
  const users = [];
  const password = await bcrypt.hash("testuser", 12);
  for (let i = 1; i <= 10; i++) {
    users.push(`('test${i}', '${password}', now())`);
  }

  await db.query(
    `insert into users (username, password, joined) values ${users.join(", ")};`
  );

  // Create user to assign to every deleted comment
  const deletedPassword = await bcrypt.hash(
    "1EF41ABF5352C5B525BC21CF9162F",
    12
  );

  await db.query(
    `insert into users (username, password, joined)
    values ('[deleted]', '${deletedPassword}', now())`
  );

  // Create topics
  const topics = [];

  for (let i = 1; i <= 5; i++) {
    topics.push(`('topic${i}', 'Description for topic ${i}')`);
  }

  await db.query(
    `insert into topics (name, description) values ${topics.join(", ")}`
  );

  // Create test posts
  const posts = [];
  for (let i = 1; i <= 10; i++) {
    const userId = Math.floor(Math.random() * 10) + 1;
    posts.push(
      `(${userId}, ${
        Math.floor(Math.random() * 5) + 1
      }, 'Post Title ${i}', 'Post text for post ${i}', now())`
    );
  }

  await db.query(
    `insert into posts (user_id, topic_id, title, text, time)
       values ${posts.join(", ")};`
  );

  // Create test comments
  const comments = [];

  for (let i = 1; i <= 50; i++) {
    const userId = Math.floor(Math.random() * 10) + 1;
    const postId = Math.floor(Math.random() * 10) + 1;
    comments.push(
      `(${userId}, ${postId}, 'This is comment ${i} on post ${postId}.', null, now())`
    );
  }

  // Create nested comments chain
  comments.push(
    `(${1}, ${1}, 'This is a parent comment on post 1', null, now())`
  );
  comments.push(
    `(${1}, ${1}, 'This is a second level nested comment on post 1', 51, now())`
  );
  comments.push(
    `(${1}, ${1}, 'This is a third level nested comment on post 1', 52, now())`
  );
  comments.push(
    `(${1}, ${1}, 'This is a fourth level nested comment on post 1', 53, now())`
  );

  await db.query(
    `insert into comments (user_id, post_id, text, parent, time) values ${comments.join(
      ", "
    )}`
  );
};

// seedDB()
//   .then(() => {
//     process.exit();
//   })
//   .catch((err) => console.log(err.message));

module.exports = seedDB;
