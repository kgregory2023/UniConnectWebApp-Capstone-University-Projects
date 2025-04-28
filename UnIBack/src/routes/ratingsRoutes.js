const express = require("express");
const ratingRoutes = express.Router({ mergeParams: true }); 
const { createRating, getAllRatings, getRatingById, getRatingsByUserId, getRatingsByLocationId, deleteRatingById } = require("../controllers/ratingController");
const authMiddleware = require("../../authMiddleware");
const authorizeRoles = require("../../roleMiddleware");
const authenticateToken = require("../../authMiddleware");

ratingRoutes.post("/", authenticateToken, authorizeRoles(["user", "admin"]), createRating);
ratingRoutes.get("/user", authMiddleware, getRatingsByUserId);

ratingRoutes.get("/", getAllRatings);
ratingRoutes.get("/location/:locationId", authenticateToken, authorizeRoles(["user", "admin"]), getRatingsByLocationId);
ratingRoutes.get("/:id", getRatingById);
ratingRoutes.delete("/:ratingId", authenticateToken, authorizeRoles(["admin", "user"]), deleteRatingById);

module.exports = ratingRoutes;