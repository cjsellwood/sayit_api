const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  }
  // local
  // database: "sayit",
  // user: "postgres",
});

module.exports = {
  query: (text, params) => {
    return pool.query(text, params);
  },
};

// Empty heroku postgres database
// heroku pg:reset DATABASE_URL

// Push local database to heroku
// heroku pg:push sayit postgresql-rectangular-90431 --app sheltered-lake-91716