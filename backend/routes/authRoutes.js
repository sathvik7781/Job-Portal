const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/authController");

// router.post("/register", register);
// router.post("/login", login);
const {
  validateRegistration,
  validateLogin,
  validate,
} = require("../middleware/validator");
const { authLimiter } = require("../middleware/rateLimiter");

// Apply rate limiting and validation
router.post("/register", authLimiter, validateRegistration, validate, register);
router.post("/login", authLimiter, validateLogin, validate, login);
module.exports = router;
