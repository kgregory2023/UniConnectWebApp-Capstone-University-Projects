require("dotenv").config({path: "./config/config.env"});

const app = require('./config/app');
const { connectToServer } = require("./config/db");
const PORT = process.env.PORT || 5000;

(async () =>{
    await connectToServer();

    app.listen(PORT, () => {
        console.log("Server running on port ${PORT}.");
    })
})();