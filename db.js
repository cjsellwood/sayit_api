const { Pool } = require("pg");
const connectionString = process.env.DB_URL;

console.log(connectionString)

const pool = new Pool({
  // Local
  // user: "postgres",
  // database: "sayit",
  connectionString,
});

module.exports = {
  query: (text, params) => {
    return pool.query(text, params);
  },
};
