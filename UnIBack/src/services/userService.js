const User = require("../models/User");
const { hashPassword, comparePassword, generateToken } = require("../../authService");

const registerUser = async (userData) => {
    const { username, email, password } = userData;

    let user = await User.findOne({ email });
    if (user) throw new Error("User already exists.");

    userData.password = await hashPassword(password);
    user = new User(userData);
    return await user.save();
};

const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid email.");

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error("Invalid password.");

    const token = generateToken(user);
    return { token, user };
};

const getUserProfile = async (userId) => {
    return await User.findById(userId).populate("ratings");
};

const updateUserProfile = async (userId, updateData) => {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
}

const deleteUser = async (userId) => {
    return await User.findByIdAndDelete(userId);
};

module.exports = {
    registerUser, loginUser, getUserProfile, updateUserProfile, deleteUser
};