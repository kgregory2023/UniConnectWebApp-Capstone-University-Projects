const express = require("express")
const ratingRoutes = require("../routes/ratingsRoutes");
const authorizeRoles = require("../roleMiddleware");
const { createLocation, getLocationById, getAllLocations, updateLocation, deleteLocation } = require("../controllers/locationController");
const locationRoutes = express.Router();

locationRoutes.get("/:id", getLocationById);
locationRoutes.get("/", getAllLocations);
locationRoutes.put("/:id", updateLocation);
locationRoutes.delete("/:id", deleteLocation);

locationRoutes.post(
    "/create",
    authenticateToken,
    authorizeRoles(["admin"]),
    createLocation
);
locationRoutes.use('/:locationId/ratings', ratingRoutes);

module.exports = locationRoutes;