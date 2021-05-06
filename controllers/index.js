const db = require("../db");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const issueJWT = require("../utils/issueJWT");

module.exports.home = catchAsync(async (req, res, next) => {
  const query = await db.query("select * from users");
  console.log(query.rows);
  res.send({ page: "Home" });
});

// Register new user
module.exports.registerUser = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  let result;

  // Handle username already exists error
  try {
    result = await db.query(
      `insert into users(username, password, joined) values($1, $2, now()) returning user_id`,
      [username, hashedPassword]
    );
  } catch (err) {
    if (err.code === "23505") {
      return next(new ExpressError(400, "Username already exists"));
    } else {
      return;
    }
  }
  const user = result.rows[0];

  // Send jwt token to user to authenticate their requests
  const jwt = issueJWT(user.user_id);

  res.status(200).json({
    message: "user registered",
    token: jwt.token,
    expiresIn: jwt.expiresIn,
  });
});

// Login user and issue new jwt token
module.exports.loginUser = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  const result = await db.query(
    `select user_id, password from users where username = $1`,
    [username]
  );

  const user = result.rows[0];

  if (!user) {
    return next(new ExpressError(404, "Incorrect username or password"));
  }
  const isValid = await bcrypt.compare(password, user.password);

  // If username and password correct, issue JWT token
  if (isValid) {
    const jwt = issueJWT(user.user_id);
    res.status(200).json({
      message: "Logged In",
      token: jwt.token,
      expiresIn: jwt.expiresIn,
    });
  } else {
    return next(new ExpressError(404, "Incorrect username or password"));
  }
});

// Create new topic
module.exports.newTopic = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;

  // Insert new topic into database if topic name unique
  try {
    await db.query(`insert into topics (name, description) values ($1, $2)`, [
      name,
      description,
    ]);
  } catch (err) {
    if (err.code === "23505") {
      return next(new ExpressError(400, "Topic already exists"));
    } else {
      return;
    }
  }

  res.status(200).json({ message: "Topic Created" });
});
