const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required."],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        match: [/.+\@.+\..+/, "Please enter a valid email address."],
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        minlength: [8, "Password must be at least 8 characters long."],
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    name: {
        type: String,
        required: [false],
    },
    phone: {
        type: String,
        required: [false],
    },
    uni: {
        type: String,
        required: [false],
    },
    age: {
        type: Number,
        required: [false],
    },
    bio: {
        type: String,
        required: [false],
    }, 
    profilePic: {
        type: String, //Store image URL
        default: "",  //Find placeholder image and insert URL here
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }],
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating",
    }],
}, 
{ timestamps: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;