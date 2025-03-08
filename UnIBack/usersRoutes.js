const express = require("express")

//Authentication Functions
const { registerUser, loginUser } = require("./authController"); 
const authMiddleware = require("./authMiddleware");

const database = require("./connect")

let usersRoutes = express.Router()

// Authentication Routes
usersRoutes.post("/register", registerUser);
usersRoutes.post("/login", loginUser);

// Protected Profile Route (Requires JWT Authentication)
usersRoutes.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: "Welcome to your profile!", user: req.user });
});

module.exports = usersRoutes;
