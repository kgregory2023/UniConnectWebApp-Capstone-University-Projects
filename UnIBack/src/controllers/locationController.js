const locationService = require("../services/locationService");

exports.createLocation = async (req, res) => {
    try {
        const location = await locationService.createLocation(req.body);
        res.status(201).json(location);
    } catch (error) {
        if(error.message === "Location already exists."){
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
};

exports.getLocationById = async (req, res) => {
    try {
        const location = await locationService.getLocationById(req.params.id);
        res.status(200).json(location);
    } catch (error) {
        if(error.message === "Location not found."){
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
};

exports.getAllLocations = async (req, res) => {
    try {
        const locations = await locationService.getAllLocations();
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
};

exports.updateLocation = async (req, res) => {
    try {
        const updatedLocation = await locationService.updateLocation(req.params.id, req.body);
        res.status(200).json(updatedLocation);
    } catch (error) {
        if(error.message === "Location not found."){
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
};

exports.deleteLocation = async (req, res) => {
    const locationId = req.params.id;

    try {
        await locationService.deleteLocation(locationId);
        res.status(204).send();
    } catch (error) {
        if(error.message === "Location not found."){
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
};