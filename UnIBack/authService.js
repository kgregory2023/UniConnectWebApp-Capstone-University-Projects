const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: "./src/config/config.env" }); 

// Password must be 8–15 characters, include uppercase, lowercase, number, and special character
const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
    if (!passwordRegex.test(password)) {
        throw new Error("Password must be 8-15 characters and include uppercase, lowercase, number, and special character.");
    }
};

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10); 
};

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username, role: user.role }, 
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

module.exports = { 
    hashPassword, 
    comparePassword, 
    generateToken, 
    validatePassword 
};
