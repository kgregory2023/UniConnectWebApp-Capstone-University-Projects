const express = require("express");
const ratingRoutes = express.Router({ mergeParams: true }); // 👈 Important to access :locationId
const { createRating, getAllRatings, getRatingById, getRatingsByUserId, getRatingsByLocationId, deleteRatingById } = require("../controllers/ratingController");
const authMiddleware = require("../../authMiddleware");

ratingRoutes.post("/", authMiddleware, createRating);
//ratingRoutes.get("/user", authMiddleware, getRatingByUserId);

ratingRoutes.get("/", getAllRatings);
ratingRoutes.get("/location/:id", getRatingsByLocationId);
ratingRoutes.get("/:id", getRatingById);
ratingRoutes.delete("/:id", deleteRatingById);

module.exports = ratingRoutes;