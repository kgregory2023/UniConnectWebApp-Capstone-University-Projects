const Location = require("../models/Location");
const Rating = require("../models/Rating");
const ratingService = require("./ratingService");
const mongoose = require("mongoose");

const createLocation = async (locationData) => {
    const { name, address, city, state } = locationData;

    let location = await Location.findOne({ name });
    if (location) throw new Error ("Location already exists.");

    location = new Location(locationData);
    return await location.save();
};

const getLocationById = async (locationId) => {
    let location = await Location.findById(locationId).populate("ratings");
    if (!location) throw new Error ("Location not found.");

    return location;
};

const getAllLocations = async () => {
    return await Location.find();
};

const updateLocation = async (locationId, locationData) => {
    let location = await Location.findById(locationId).populate("ratings");
    if(!location) throw new Error("Location not found.");

    return await Location.findByIdAndUpdate(locationId, locationData, { new: true });
};

const deleteLocation = async (locationId) => {
    let location = await Location.findById(locationId);
    if (!location) throw new Error("Location not found.");
    
    try {
        await Rating.deleteMany({ location: locationId });
        
        const deletedLocation = await Location.findByIdAndDelete(locationId);
        return deletedLocation;
    } catch (error) {
        throw new Error(`Failed to delete location: ${error.message}`);
    }
};

module.exports = {
    createLocation, getLocationById, getAllLocations, updateLocation, deleteLocation
};