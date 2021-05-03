if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

// Defined routes
const indexRouter = require("./routes/index")

// Use defined routes
app.use(indexRouter);

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("Listening on port " + port);
});
