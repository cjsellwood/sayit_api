const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;

console.log(connectionString)

const pool = new Pool({
  connectionString,
});

module.exports = {
  query: (text, params) => {
    return pool.query(text, params);
  },
};
