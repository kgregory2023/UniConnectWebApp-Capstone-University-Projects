const express = require("express");
const { createTag, getTagById, getPredefinedTags, getAllTags, updateUserTag, deleteTag } = require("../controllers/tagController");
const authMiddleware = require("../../authMiddleware");
const tagsRoutes = express.Router();

tagsRoutes.post("", authMiddleware, createTag);
tagsRoutes.get("", getTagById);
tagsRoutes.get("/predefined", getPredefinedTags);
tagsRoutes.get("", getAllTags);
tagsRoutes.delete("", authMiddleware, deleteTag);

module.exports = tagsRoutes;