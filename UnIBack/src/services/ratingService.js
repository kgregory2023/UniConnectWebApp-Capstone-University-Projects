const Rating = require("../models/Rating");
const mongoose = require("mongoose");

const createRating = async (ratingData) => {
    const { user, location, value, text } = ratingData;

    if (!user) {
        throw new Error("You are not authorized to do that.");
    }
    if (value < 1 || value > 5) {
        throw new Error("Rating value must be between 1 and 5.");
    }
    if (!text) {
        throw new Error("Comment text is a required field.");
    }

    const rating = new Rating(ratingData);
    return await rating.save();
};

const getAllRatings = async () => {
    return await Rating.find();
};

const getRatingById = async (ratingId) => {
    let rating = await Rating.findById(ratingId);
    if (!rating) throw new Error("Rating not found.");

    return rating;
};

const getRatingsByUserId = async (userId) => {
    return await Rating.find({ user: userId });    
};

const getRatingsByLocationId = async (locationId) => {
    return await Rating.find({ location: locationId });
};

const deleteRatingById = async (ratingId) => {
    let rating = await Rating.findByIdAndDelete(ratingId);
    if (!rating) throw new Error("Rating not found.");

    return rating;
};

module.exports = {
    createRating, getAllRatings, getRatingById, getRatingsByUserId, getRatingsByLocationId, deleteRatingById
}