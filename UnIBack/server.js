const express = require("express");
const cors = require("cors");
const { connectToServer } = require("./connect"); // Import MongoClient connection
const usersRoutes = require("./usersRoutes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Load routes
app.use("/api/users", usersRoutes);

// Connect to MongoDB and then start the server
connectToServer()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });