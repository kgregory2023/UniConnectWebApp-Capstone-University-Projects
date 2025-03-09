const express = require('express');
const app = express();
const routes = require('../routes');
const userRoutes = require('../routes/usersRoutes');

app.use(express.json()); //middleware to parse JSON
app.use("/users", userRoutes);
//Add more middleware as needed

module.exports = app;