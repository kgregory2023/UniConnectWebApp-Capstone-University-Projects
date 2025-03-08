const express = require('express');
const app = express();
const routes = require('../routes');

app.use(express.json()); //middleware to parse JSON
//Add more middleware as needed

module.exports = app;