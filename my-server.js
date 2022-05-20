'use strict';

// REQUIRE
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const getWeather = require('./modules/my-weather');
const getMovies = require('./modules/movies');

require('dotenv').config();

// USE
const app = express();

app.use(cors());
const PORT = process.env.PORT || 3002;

// ROUTES
// ----- home -----
app.get('/', (req,res) => res.send('Ready to receive.'));

// ----- weather ------
app.get('/weather', getWeather);

// ----- movies -----
app.get('/movies', getMovies);

// ----- catch all -----
app.get('/*', (req, res) => res.send('This is not the page you\'re looking for.'));

// ERRORS
app.use((error, req, res, next) => {
  res.status(500).send(error.message);
});

// LISTEN
app.listen(PORT, () => console.log(`listening on port ${PORT}`))