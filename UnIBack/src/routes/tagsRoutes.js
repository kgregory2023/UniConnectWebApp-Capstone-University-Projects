const express = require("express");
const { createTag, getTagById, getPredefinedTags, getAllTags, updateUserTag, deleteTag } = require("../controllers/tagController");
const authMiddleware = require("../../authMiddleware");
const tagsRoutes = express.Router();

tagsRoutes.post("/tags", authMiddleware, createTag);
tagsRoutes.get("/tags", getTagById);
tagsRoutes.get("/tags/predefined", getPredefinedTags);
tagsRoutes.get("/tags", getAllTags);
tagsRoutes.delete("/tags", authMiddleware, deleteTag);

module.exports = tagsRoutes;