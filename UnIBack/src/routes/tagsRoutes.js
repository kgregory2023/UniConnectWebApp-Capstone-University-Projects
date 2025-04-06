const express = require("express");
const { createTag, getTagById, getPredefinedTags, getAllTags, deleteTag } = require("../controllers/tagController");
const authMiddleware = require("../../authMiddleware");
const tagsRoutes = express.Router();

tagsRoutes.post("/profile/tags", authMiddleware, createTag);
tagsRoutes.get("/profile/tags/:id", getTagById);
tagsRoutes.get("/profile/tags/predefined", getPredefinedTags);
tagsRoutes.get("/profile/tags", getAllTags);
tagsRoutes.delete("/profile/tags/:id", authMiddleware, deleteTag);

module.exports = tagsRoutes;