// Connect to postgres database
const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  database: "sayit",
});

client.connect();

const createDB = async () => {
  // Remove old tables
  await client.query("drop table if exists users, topics, posts;");

  // Create tables
  await client.query(`create table users (
    user_id serial primary key,
    username varchar(100) unique not null,
    password varchar(100) not null,
    joined timestamp not null
  );`);

  await client.query(`create table topics (
    topic_id serial primary key,
    name varchar(100) not null,
    description varchar(255) not null
  )`);

  await client.query(`create table posts (
    post_id serial primary key,
    user_id int not null references users,
    topic_id int not null references topics,
    title text not null,
    text text,
    time timestamp not null
  )`);

  const res = await client.query("select now()");
  console.log(res.rows[0]);
};

createDB()
  .then(() => {
    client.end();
  })
  .catch((err) => console.log(err.message));
