const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
     _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: true,
    },
    value: {
        type: Number,
        required: true,
        min: [1, "Rating must be at least 1."],
        max: [5, "Rating cannot be more than 5."],
    }
}, { timestamps: true });

const Rating = mongoose.model("Rating", RatingSchema);
module.exports = Rating;