const express = require("express")

//Declared getSwipeUsers
const { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUser, getSwipeUsers} = require("../controllers/userController");
const authMiddleware = require("../../authMiddleware");
const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);

userRoutes.get("/profile", authMiddleware, getUserProfile);
userRoutes.put("/profile", authMiddleware, updateUserProfile);
userRoutes.delete("/profile", authMiddleware, deleteUser);

//Swipe Route
userRoutes.get("/swipe/:count", authMiddleware, getSwipeUsers);

module.exports = userRoutes;