const db = require("../db");
const catchAsync = require("../utils/catchAsync");

module.exports.home = catchAsync(async (req, res, next) => {
  const query = await db.query("select * from users");
  console.log(query.rows);
  res.send({ page: "Home" });
});
