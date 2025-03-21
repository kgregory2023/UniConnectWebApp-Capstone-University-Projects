const tagService = require("../services/tagService");

exports.createTag = async (req, res) => {
    try {
        const { tagName, tagCatagory } = req.body;

        if (!tagName) {
            return res.status(400).json({ message: "Tag name is required." });
        } else if (!tagCatagory) {
            return res.status(400).json({ message: "Tag catagory is required." });
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
        const tag = await tagService.getTagById(req.tag.id);

        if (!tag) {
            return res.status(404).json({ message: "Tag not found." });
        }

        res.status(200).json(tag);
    } catch (error) {

    }
};

exports.getPredefinedTags = async (req, res) => {
    try {
        const preTags = await tagService.getPredefinedTags();
        res.status(200).json(preTags);
    } catch (error) {
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
        const tag = await tagService.getTagById(req.tag.id);
        if (!tag) {
            return res.status(404).json({ message: "Tag not found." });
        }

        if (req.user.role !== "admin") {
            res.status(403).json({ message: "Forbidden: You cannot delete this." });
        }

        await tagService.deleteTag(req.tag.id);
        res.status(204).json({ });
    } catch (error) {
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
};