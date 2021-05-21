const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  // connectionString,
  // ssl: {
  //   rejectUnauthorized: false,
  // }
  // local
  database: "sayit",
  user: "postgres",
});

module.exports = {
  query: (text, params) => {
    return pool.query(text, params);
  },
};
