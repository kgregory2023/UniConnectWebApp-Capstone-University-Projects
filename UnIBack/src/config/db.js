const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });

const connectToServer = async () => {
    try {
        await mongoose.connect(process.env.AURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverApi: {
                version: 1,
                strict: true,
                depreciationErrors: true,
            },
        });
        console.log("Suuccessfully connected to MongoDB using mongoose.");
    } catch (error) {
        console.error("MongoDB Connection Error: ", error);
        process.exit(1);
    }
};

module.exports = { connectToServer };