const db = require("../db");
const bcrypt = require("bcrypt")
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const issueJWT = require("../utils/issueJWT")

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

  console.log(result);

  // Send jwt token to user to authenticate their requests
  const jwt = issueJWT(result.rows[0].user_id);

  res.status(200).json({
    message: "user registered",
    token: jwt.token,
    expiresIn: jwt.expiresIn,
  });
});

module.exports.loginUser = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
});

module.exports.protected = (req, res) => {
  res.json({ message: "Protected route" });
};
