if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

// Defined routes
const indexRouter = require("./routes/index")

// Use defined routes
app.use(indexRouter);

// Error handling
app.use((err, req, res) => {
  console.log(err.message);
  res.send({error: err.message})
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("Listening on port " + port);
});
