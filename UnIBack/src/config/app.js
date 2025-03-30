const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const app = express();
const userRoutes = require('../routes/usersRoutes');
const tagsRoutes = require('../routes/tagsRoutes');

const logStream = fs.createWriteStream(path.join(__dirname, 'requests.log'), {flags: 'a' });

app.use(express.json()); //middleware to parse JSON
app.use(morgan("combined", { stream: logStream }));
app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
}));
app.use("/users", userRoutes);
app.use("/profile", tagsRoutes);
//Add more middleware as needed

module.exports = app;