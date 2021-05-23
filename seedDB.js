if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Connect to postgres database
const db = require("./db");
const bcrypt = require("bcrypt");
const faker = require("faker");

const seedDB = async () => {
  // Create user to assign to every deleted comment
  const deletedPassword = await bcrypt.hash(process.env.DELETED_PASSWORD, 12);

  await db.query(
    `insert into users (username, password, joined)
      values ('[deleted]', '${deletedPassword}', now())`
  );

  // Create test users
  const users = [];
  const password = await bcrypt.hash("testuser", 12);
  for (let i = 1; i <= 10; i++) {
    users.push(
      `('${faker.internet.userName()}',
      '${password}',
      '${faker.date.past().toISOString()}')`
    );
  }

  await db.query(
    `insert into users (username, password, joined) values ${users.join(", ")};`
  );

  // Create topics
  const topics = [];

  const exampleTopics = ["animals", "food", "technology", "cars", "news"];
  for (let i = 1; i <= 5; i++) {
    topics.push(
      `('${exampleTopics[i - 1]}', '${faker.lorem.text().substring(0, 254)}')`
    );
  }

  await db.query(
    `insert into topics (name, description) values ${topics.join(", ")}`
  );

  // Create test posts
  const posts = [];
  for (let i = 1; i <= 88; i++) {
    const userId = Math.floor(Math.random() * 10) + 2;
    const topicId = Math.floor(Math.random() * 5) + 1;

    let postText = faker.lorem.lines();
    if (i % 5 === 0) {
      const links = [
        "https://www.youtube.com/watch?v=h6vERdmuV5U",
        "https://www.youtube.com/watch?v=JkaxUblCGz0",
        "https://i.redd.it/wftjc8bm1k071.jpg",
        "https://i.redd.it/6f0el75jbkz61.jpg",
        "https://reactjs.org/docs/getting-started.html",
      ];
      postText = `<<<Link>>>${links[Math.floor(Math.random() * 5)]}`;
    }
    posts.push(
      `(${userId}, ${topicId},
      '${faker.lorem.sentence()}',
      '${postText}'
      ,'${faker.date
        .between(
          new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
          new Date(Date.now())
        )
        .toISOString()}')`
    );
  }

  await db.query(
    `insert into posts (user_id, topic_id, title, text, time)
       values ${posts.join(", ")};`
  );

  // Create test comments
  const comments = [];
  const values = [];

  for (let i = 1; i <= 500; i++) {
    const userId = Math.floor(Math.random() * 10) + 2;
    let postId = Math.floor(Math.random() * 75) + 1;
    let parentId = Math.floor(Math.random() * i) + 1;

    if (i > 5) {
      if (Math.random() < 0.25 || parentId === i) {
        parentId = null;
      } else {
        postId = values[parentId - 1].postId;
      }
    } else {
      parentId = null;
    }

    values.push({ comment_id: i, postId, parentId });

    comments.push(
      `(${userId}, 
      ${postId},
      '${faker.lorem.text()}',
      ${parentId},
      '${faker.date.recent().toISOString()}')`
    );
  }

  await db.query(
    `insert into comments (user_id, post_id, text, parent, time) values ${comments.join(
      ", "
    )}`
  );

  const postVotes = [];
  for (let i = 1; i <= 75; i++) {
    const vote = Math.floor(Math.random() * 3) - 1;
    const postId = i;
    const votes = Math.floor(Math.random() * 21) - 10;
    const userVotes = [];
    let j = 0;

    while (userVotes.length < Math.abs(votes)) {
      userVotes.push(j + 2);
      j++;
    }

    for (let k = 0; k < userVotes.length; k++) {
      if (userVotes.length) {
        postVotes.push(`(${userVotes[k]}, ${postId}, ${vote})`);
      }
    }
  }

  // Create test votes
  await db.query(
    `insert into votes (user_id, post_id, vote) values ${postVotes.join(", ")}`
  );
};

module.exports = seedDB;
