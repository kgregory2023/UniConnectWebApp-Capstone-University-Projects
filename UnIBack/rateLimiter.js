const rateLimit = require('express-rate-limit');

const normalAuthLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later.",
});

const authLimiter = process.env.NODE_ENV === "test"
  ? (req, res, next) => next() // skip in test mode
  : normalAuthLimiter;

const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: "Too many requests, slow down.",
});

module.exports = {
  authLimiter,
  generalLimiter,
};