const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

// Hash password before storing
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);  // 10 salt rounds
};

// Compare entered password with hashed password in DB
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token for authentication
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username }, 
        process.env.JWT_SECRET, 
        { expiresIn: "1h" }  // 1-hour expiration
    );
};

module.exports = { hashPassword, comparePassword, generateToken };