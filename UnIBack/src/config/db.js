const mongoose = require("mongoose");

const connectToServer = async () => {
    try {
        const AURI = process.env.AURI;
        console.log("URI", AURI);
        await mongoose.connect(AURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Suuccessfully connected to MongoDB using mongoose.");
    } catch (error) {
        console.error("MongoDB Connection Error: ", error);
        process.exit(1);
    }
};

module.exports = { connectToServer };