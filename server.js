'use strict';

// REQUIRE
require('dotenv');
const express = require('express');
const cors = require('cors');
const getWeather = require('./modules/weather.js');
const getMovies = require('./modules/movies');

require('dotenv').config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;

//ROUTES
app.get('/', (req,res) => res.send('Ready to receive.'));

app.get('/weather', weatherHandler);

app.get('/movies', getMovies);

app.get('/*', (req, res) => res.send('This is not the page you\'re looking for.'));

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  getWeather(lat, lon)
  .then(summaries => response.send(summaries))
  .catch((error) => {
    console.error(error);
    response.status(500).send('Sorry. Something went wrong!')
  });
}  

app.listen(PORT, () => console.log(`Server up on ${PORT}`));