const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
    _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    category: {
        type: String,
        enum: ["Languages", "Hobbies", "Interests", "Music", "Personality Type", "Looking For", "Clubs/Sports"],
        required: true,
    },
    isPredefined: {
        type: Boolean,
        default: false,
    }
});

const Tag = mongoose.model("Tag", TagSchema);
module.exports = Tag;