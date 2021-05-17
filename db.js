const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  database: "sayit",
});

module.exports = {
  query: (text, params) => {
    return pool.query(text, params);
  },
};
