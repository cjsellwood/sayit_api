if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const ExpressError = require("./utils/ExpressError");
const db = require("./db");

// Defined routes
const indexRouter = require("./routes/index");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");

// Parse requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Allow requests from frontend
app.use(cors());

// Minimize size of app
app.use(compression());

// Secure app
app.use(helmet());

// Passport with jwt configuration
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_PRIVATE;

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    const result = await db.query(
      "select user_id, username from users where user_id = $1",
      [payload.sub]
    );

    const user = result.rows[0];

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  })
);

app.use(passport.initialize());

// Use defined routes
app.use("/", indexRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);

// Handle undefined route error
app.use("*", (req, res, next) => {
  return next(new ExpressError(404, "Route does not exist"));
});

// Error handling
app.use((err, req, res, next) => {
  console.log("ERROR", err.message, err.statusCode);
  res.status((err.statusCode = 400)).json({ error: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Listening on port " + port);
});
