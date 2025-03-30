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
        required: [true, "State is required."],
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

LocationSchema.methods.calculateAverageRating = async function () {
    const location = await this.populate("ratings").execPopulate();
    if (location.ratings.length > 0) {
        const sum = location.ratings.reduce((acc, rating) => acc + rating.value, 0);
        this.averageRating = sum / location.ratings.length;
    } else {
        this.averageRating = 0;
    }

    await this.save();
};

const Location = mongoose.model("Location", LocationSchema);
module.exports = Location;