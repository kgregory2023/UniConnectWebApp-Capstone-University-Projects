const express = require("express")
const { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUser } = require("../controllers/userController");
const authMiddleware = require("../../authMiddleware");
const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);

userRoutes.get("/profile", authMiddleware, getUserProfile);
userRoutes.put("/profile", authMiddleware, updateUserProfile);
userRoutes.delete("/profile", authMiddleware, deleteUser);

module.exports = userRoutes;