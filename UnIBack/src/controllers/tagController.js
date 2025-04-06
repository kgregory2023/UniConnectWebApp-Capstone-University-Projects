const tagService = require("../services/tagService");

exports.createTag = async (req, res) => {
    try {
        const { name, category } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Tag name is required." });
        } else if (!category) {
            return res.status(400).json({ message: "Tag category is required." });
        }

        const tag = await tagService.createTag(req.body);
        res.status(201).json(tag);
    } catch (error) {
        if (error.message === "Tag already exists.") {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error: " + error.message });    
    }
};

exports.getTagById = async (req, res) => {
    try {
        const tag = await tagService.getTagById(req.params.id);

        if (!tag) {
            return res.status(404).json({ message: "Tag not found." });
        }

        res.status(200).json(tag);
    } catch (error) {
        res.status(500).json({ message: "Internal server error: " + error.message });    
    }
};

exports.getPredefinedTags = async (req, res) => {
    try {
        const preTags = await tagService.getPredefinedTags();
        console.log("Returned preTags:", preTags); // Log the returned tags
        res.status(200).json(preTags);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error: " + error.message });    
    }
};

exports.getAllTags = async (req, res) => {
    try {
        const tags = await tagService.getAllTags();
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ message: "Internal server error: " + error.message });    
    }
};

exports.deleteTag = async (req, res) => {
    try {
        const tag = await tagService.getTagById(req.params.id);
        if (!tag) {
            return res.status(404).json({ message: "Tag not found." });
        }

        if (req.user.role !== "admin") {
            res.status(403).json({ message: "Forbidden: You cannot delete this." });
        }

        await tagService.deleteTag(req.params.id);
        res.status(204).json({ });
    } catch (error) {
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
};