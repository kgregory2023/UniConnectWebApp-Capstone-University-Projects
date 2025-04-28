const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, 
  max: 5, // 5 attempts max for login
  message: "Too many login attempts, please try again later.",
});

const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per minute
  message: "Too many requests, slow down.",
});

module.exports = {
  authLimiter,
  generalLimiter,
};