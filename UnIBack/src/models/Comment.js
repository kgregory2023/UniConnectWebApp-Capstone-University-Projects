const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
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
    text: {
        type: String,
        required: [true, "Comment cannot be empty."],
    },
}, { timestamps: true });

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;