const userService = require("../services/userService");

exports.registerUser = async (req, res) => {
    try {
        const user = await userService.registerUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(412).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { token, user } = await userService.loginUser(req.body);
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await userService.getUserProfile(req.user._id);
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json ({ message: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const updatedUser = await userService.updateUserProfile(req.user._id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await userService.deleteUser(req.user._id);
        res.status(204).json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};