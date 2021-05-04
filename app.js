if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

// Connect to postgres database
const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  database: "sayit",
});

client.connect();


// Defined routes
const indexRouter = require("./routes/index")

// Use defined routes
app.use(indexRouter);

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("Listening on port " + port);
});
