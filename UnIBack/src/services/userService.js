const User = require("../models/User");
const Tag = require("../models/Tag");
const { hashPassword, comparePassword, generateToken } = require("../../authService");
const mongoose = require("mongoose");

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
    return await User.findById(userId).populate("ratings tags");
};

const updateUserProfile = async (userId, updateData) => {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
}

const deleteUser = async (userId) => {
    return await User.findByIdAndDelete(userId);
};

const addTagsToUser = async(userId, tagIds) => {
    const existingTags = await Tag.find({ _id: { $in: tagIds } });
    if (existingTags.length !== tagIds.length) {
        throw new Error("One or more tags are invalid.");
    }

    return await User.findByIdAndUpdate(userId, 
        { $addToSet: { tags: { $each: tagIds } } },
        { new: true },
    ).populate("tags");
};

const removeTagsFromUser = async (userId, tagIds) => {
    return await User.findByIdAndUpdate(userId, 
        { $pull: { tags: { $in: tagIds } } },
        { new: true },
    ).populate("tags");
};

//get function for swipeUsers
const getSwipeUsers = async (userId, count) => {
    return await User.aggregate([
        { $match: { _id: { $ne: new mongoose.Types.ObjectId(userId) } } },
        { $sample: { size: count } }
    ]);
};

// added getSwipeUsers
module.exports = {
    registerUser, loginUser, getUserProfile, updateUserProfile, deleteUser, getSwipeUsers, addTagsToUser, removeTagsFromUser
};
