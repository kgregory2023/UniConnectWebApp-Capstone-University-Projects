const express = require("express")

const { createLocation, getLocationById, getAllLocations, updateLocation, deleteLocation } = require("../controllers/locationController");
const locationRoutes = express.Router();

locationRoutes.post("/", createLocation);
locationRoutes.get("/:id", getLocationById);
locationRoutes.get("/", getAllLocations);
locationRoutes.put("/:id", updateLocation);
locationRoutes.delete("/:id", deleteLocation);

module.exports = locationRoutes;