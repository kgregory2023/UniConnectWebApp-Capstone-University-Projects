const express = require("express");
const router = express.Router({ mergeParams: true }); // 👈 Important to access :locationId
const { createRating } = require("../controllers/ratingController");
const ratingRoutes = express.Router();
const authMiddleware = require("../../authMiddleware");

ratingRoutes.post("/", authMiddleware, createRating);

module.exports = ratingRoutes;