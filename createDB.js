// Connect to postgres database
const db = require("./db");
const seedDB = require("./seedDB");

const createDB = async () => {
  // Remove old tables
  await db.query("drop table if exists users, topics, posts, comments, votes;");

  // Create tables
  await db.query(`create table users (
    user_id serial primary key,
    username varchar(100) unique not null,
    password varchar(100) not null,
    joined timestamp not null
  );`);

  await db.query(`create table topics (
    topic_id serial primary key,
    name varchar(100) unique not null,
    description varchar(255) not null
  )`);

  await db.query(`create table posts (
    post_id serial primary key,
    user_id int not null references users,
    topic_id int not null references topics,
    title text not null,
    text text,
    time timestamp not null
  )`);

  await db.query(`create table comments (
    comment_id serial primary key,
    user_id int not null references users,
    post_id int not null references posts on delete cascade,
    text text not null,
    parent int references comments,
    time timestamp not null
  )`);

  await db.query(`create table votes (
    vote_id serial primary key,
    user_id int not null references users,
    post_id int not null references posts on delete cascade,
    vote smallint,
    unique (user_id, post_id)
  )`);

  const res = await db.query("select now()");
  console.log(res.rows[0]);

  await seedDB();
};

createDB()
  .then(() => {
    process.exit();
  })
  .catch((err) => console.log(err.message));
