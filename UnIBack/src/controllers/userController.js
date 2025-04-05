const userService = require("../services/userService");


exports.registerUser = async (req, res) => {
    try {
        const user = await userService.registerUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        if (error.message === "User already exists.") {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error: " + error.message });    
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { token, user } = await userService.loginUser(req.body);
        res.status(200).json({ token, user });
    } catch (error) {
        if(error.message === "Invalid password."){
            return res.status(401).json({ message: error.message });
        };
        if(error.message === "Invalid email."){
            return res.status(404).json({ message: error.message });
        };
        res.status(500).json({ message: "Internal server error: " + error.message });    
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await userService.getUserProfile(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: "User profile not found." });    
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const updatedUser = await userService.updateUserProfile(req.user.id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(404).json({ message: "User profile not found." });    
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await userService.deleteUser(req.user.id);
        res.status(204).json({});
    } catch (error) {
        res.status(404).json({ message: "User profile not found." });    
    }
};

// SwipeUserController export
exports.getSwipeUsers = async (req, res) => {
    try {
        const count = parseInt(req.params.count) || 5;
        console.log("Swipe request from user:", req.user.id, "for count:", count); //debugging purposes
        const users = await userService.getSwipeUsers(req.user.id, count);
        res.status(200).json(users);
    } catch (error) {
        console.error("Swipe Error:", error); // Prints Error in console, if any
        res.status(500).json({ message: "Failed to fetch users" });
    }
};
