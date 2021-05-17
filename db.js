const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL + "sslmode=require";

const pool = new Pool({
  connectionString,
});

module.exports = {
  query: (text, params) => {
    return pool.query(text, params);
  },
};
