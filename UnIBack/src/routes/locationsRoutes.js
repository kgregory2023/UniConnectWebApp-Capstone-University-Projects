const express = require("express")
const ratingRoutes = require("../routes/ratingsRoutes");
const authorizeRoles = require("../../roleMiddleware");
const authenticateToken = require("../../authMiddleware");
const { createLocation, getLocationById, getAllLocations, updateLocation, deleteLocation } = require("../controllers/locationController");
const locationRoutes = express.Router();

locationRoutes.get("/:id", getLocationById);
locationRoutes.get("/", getAllLocations);
locationRoutes.put("/:id", updateLocation);
locationRoutes.delete("/:id", authenticateToken, authorizeRoles(["admin"]), deleteLocation);


locationRoutes.post("/create", authenticateToken, authorizeRoles(["admin", "user"]), createLocation);
locationRoutes.use('/:locationId/ratings', ratingRoutes);

module.exports = locationRoutes;