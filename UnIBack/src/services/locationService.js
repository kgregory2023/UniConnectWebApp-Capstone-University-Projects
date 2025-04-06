const Location = require("../models/Location");
const mongoose = require("mongoose");

const createLocation = async (locationData) => {
    const { name, address, city, state } = locationData;

    let location = await Location.findOne({ name });
    if (location) throw new Error ("Location already exists.");

    location = new Location(locationData);
    return await location.save();
};

const getLocationById = async (locationId) => {
    let location = await Location.findById({ _id: locationId }).populate("ratings");
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
    let location = await Location.findById({ _id: locationId }).populate("ratings");
    if (!location) throw new Error("Location not found.");

    return await Location.findByIdAndDelete(locationId);
};

module.exports = {
    createLocation, getLocationById, getAllLocations, updateLocation, deleteLocation
};