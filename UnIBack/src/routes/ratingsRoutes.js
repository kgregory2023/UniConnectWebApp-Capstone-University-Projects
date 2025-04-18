const express = require("express");
const ratingRoutes = express.Router({ mergeParams: true }); // 👈 Important to access :locationId
const { createRating } = require("../controllers/ratingController");
const authMiddleware = require("../../authMiddleware");

ratingRoutes.post("/", authMiddleware, createRating);

module.exports = ratingRoutes;