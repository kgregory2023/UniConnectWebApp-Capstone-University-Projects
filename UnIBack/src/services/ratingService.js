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

module.exports = {
    createRating
}