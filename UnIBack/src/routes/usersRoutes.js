const express = require("express")
const rateLimit = require('express-rate-limit');
const { authLimiter } = require('../../rateLimiter');

//Declared getSwipeUsers
const { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUser, getSwipeUsers} = require("../controllers/userController");
const authMiddleware = require("../../authMiddleware");
const userRoutes = express.Router();

userRoutes.post('/login', authLimiter, loginUser);
userRoutes.post('/register', authLimiter, registerUser);

userRoutes.get("/profile", authMiddleware, getUserProfile);
userRoutes.put("/profile", authMiddleware, updateUserProfile);
userRoutes.delete("/profile", authMiddleware, deleteUser);
userRoutes.get("/swipe/:count", authMiddleware, getSwipeUsers); //Swipe Route

module.exports = userRoutes;