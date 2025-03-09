const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: "./src/config/config.env"}); 

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10); 
};

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username }, 
        process.env.JWT_SECRET, 
        { expiresIn: "3h" } 
    );
};

module.exports = { hashPassword, comparePassword, generateToken };