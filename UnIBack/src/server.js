const app = require('./app');
const { connectToServer } = require("./db");
const PORT = process.env.PORT || 3000;

(async () =>{
    await connectToServer();

    app.listen(PORT, () => {
        console.log("Server running on port ${PORT}.");
    })
})();