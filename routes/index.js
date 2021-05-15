const express = require("express");
const router = express.Router();
const passport = require("passport");
const index = require("../controllers/index");
const {
  validateRegister,
  validateLogin,
  validateNewTopic,
} = require("../middleware");

router.post("/register", validateRegister, index.registerUser);

router.post("/login", validateLogin, index.loginUser);

router.post(
  "/newtopic",
  validateNewTopic,
  passport.authenticate("jwt", { session: false }),
  index.newTopic
);

module.exports = router;
