import rateLimit from 'express-rate-limit';


export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  message: 'Too many requests from this IP, please try again after 15 minutes',
});


export const authLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, 
  max: 5, // Only 10 login attempts every 15 minutes
  message: 'Too many login attempts, please try again after 15 minutes',
});