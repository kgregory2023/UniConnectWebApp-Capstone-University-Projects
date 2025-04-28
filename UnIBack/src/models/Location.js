const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
     _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
    name: {
        type: String,
        required: [true, "Location name is required."],
    },
    address: {
        type: String,
        required: [true, "Address is required."],
    },
    city: {
        type: String,
        required: [true, "City is required."],
    },
    state: {
        type: String,
    },
    latitude: {
        type: String
    },
    longitude: {
        type: String
    },
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating"
    }],
    averageRating: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const Location = mongoose.model("Location", LocationSchema);
module.exports = Location;