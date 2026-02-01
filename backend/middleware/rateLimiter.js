/**
 * Rate limiting middleware to prevent abuse
 * Note: For production, use redis-based rate limiting
 */

const rateLimit = require("express-rate-limit");

// General API rate limiter
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limit for auth routes
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  skipSuccessfulRequests: true, // don't count successful requests
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later",
  },
});

// Application submission rate limiter
exports.applicationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit to 10 applications per hour
  message: {
    success: false,
    message: "Too many applications submitted, please try again later",
  },
});

// Job posting rate limiter for recruiters
exports.jobPostLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit to 20 job posts per hour
  message: {
    success: false,
    message: "Too many job postings, please try again later",
  },
});
