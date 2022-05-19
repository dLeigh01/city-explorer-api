'use strict';

// REQUIRE
const express = require('express');
const cors = require('cors');
const { response } = require('express');
const axios = require('axios');

require('dotenv').config();

// USE
const app = express();

app.use(cors());
const PORT = process.env.PORT || 3002;

// ROUTES
// ----- home -----
app.get('/', (req,res) => res.send('Ready to receive.'));

// ----- weather ------
app.get('/weather', async (req, res, next) => {
  try {
    let city = req.query.searchQuery;
    let lat = req.query.lat;
    let lon = req.query.lon;
    let selectedCity = await axios.get(`http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHERBIT_KEY}&units=I&days=3&lat=${lat}&lon=${lon}`);
    let dataToSend = [];

    selectedCity.data.data.forEach(day => dataToSend.push(new Forecast(day)));
    res.send(dataToSend);
  } catch (error) {
    next(error);
  }
});

// ----- movies -----
app.get('/movies', async (req, res, next) => {
  try {
    let city = req.query.searchQuery;
    let movies = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIEDB_KEY}&language=en-US&query=${city}&include_adult=false`);
    let dataToSend = [];

    movies.data.results.forEach(movie => dataToSend.push(new Movie(movie)));
    res.send(dataToSend);
  } catch (error) {
    next(error);
  }
})

// ----- catch all -----
app.get('/*', (req, res) => res.send('This is not the page you\'re looking for.'));

// ERRORS
app.use((error, req, res, next) => {
  res.status(500).send(error.message);
});

// CLASSES
class Forecast {
  constructor(forecastObj) {
    this.date = forecastObj.valid_date;
    this.description = forecastObj.weather.description;
    this.low = forecastObj.low_temp;
    this.high = forecastObj.max_temp;
  }
}

class Movie {
  constructor(movieObj) {
    this.title = movieObj.original_title;
    this.overview = movieObj.overview;
    this.average_votes = movieObj.vote_average;
    this.total_votes = movieObj.vote_count;
    this.image_url = movieObj.poster_path;
    this.popularity = movieObj.popularity;
    this.released_on = movieObj.release_date;
  }
}

// LISTEN
app.listen(PORT, () => console.log(`listening on port ${PORT}`))