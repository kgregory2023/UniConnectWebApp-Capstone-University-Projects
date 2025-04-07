const userService = require("../services/userService");
const tagService = require("../services/tagService");


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

exports.addTagsToUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { tagIds } = req.body;

        if (!tagIds || !Array.isArray(tagIds)) {
            return res.status(400).json({ message: "Invalid tag data." });
        }

        const updatedUser = await userService.addTagsToUser(userId, tagIds);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
};

exports.removeTagsFromUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { tagIds } = req.body;

        if (!tagIds || !Array.isArray(tagIds)) {
            return res.status(400).json({ message: "Invalid tag data." });
        }

        const updatedUser = await userService.removeTagsFromUser(userId, tagIds);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
};

exports.createAndAddTagToUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { tagName, tagCatagory } = req.body;

        if (!tagName) {
            return res.status(400).json({ message: "Tag name is required." });
        } else if (!tagCatagory) {
            return res.status(400).json({ message: "Tag catagory is required." });
        }

        let tag = await tagService.getTagByName(tagName);

        if (!tag) {
            tag = await tagService.createTag({ tagName, tagCatagory });
        }

        const updatedUser = await userService.addTagsToUser(userId, [tag.id]);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.stats(500).json({ message: "Internal server error: " + error.message });
    }
};

// SwipeUserController export
exports.getSwipeUsers = async (req, res) => {
    try {
        const count = parseInt(req.params.count) || 5;
        const users = await userService.getSwipeUsers(req.user.id, count);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};
