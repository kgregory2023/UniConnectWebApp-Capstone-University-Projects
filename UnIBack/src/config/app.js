const express = require('express');
const app = express();
const routes = require('./routes');

app.use(express.json()); //middleware to parse JSON
app.use('/api', routes); //all routes prefixed with /api
//Add more middleware as needed

module.exports = app;