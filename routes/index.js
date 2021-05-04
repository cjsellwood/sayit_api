const express = require("express");
const router = express.Router();
const passport = require("passport");
const index = require("../controllers/index");
const { validateRegister, validateLogin } = require("../middleware");

router.get("/", index.home);

router.post("/register", validateRegister, index.registerUser);

router.post("/login", validateLogin, index.loginUser);

// Protected route for only logged in users
router.get("/protected", passport.authenticate("jwt", { session: false }));

module.exports = router;
