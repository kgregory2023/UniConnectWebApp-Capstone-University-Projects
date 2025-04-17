const express = require("express");
const { createTag, getTagById, getPredefinedTags, getAllTags, deleteTag } = require("../controllers/tagController");
const authMiddleware = require("../../authMiddleware");
const tagsRoutes = express.Router();

tagsRoutes.post("/tags", authMiddleware, createTag);
tagsRoutes.get("/tags/predefined", getPredefinedTags);
tagsRoutes.get("/tags/:id", getTagById);
tagsRoutes.get("/tags", getAllTags);
tagsRoutes.delete("/tags/:id", authMiddleware, deleteTag);

module.exports = tagsRoutes;