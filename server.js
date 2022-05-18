'use strict';

// REQUIRE
const express = require('express');
let weather = require('./data/weather.json');
const cors = require('cors');
const { response } = require('express');

require('dotenv').config();

// USE
const app = express();

app.use(cors());
const PORT = process.env.PORT || 3002;

// ROUTES
app.get('/weather', (req, res, next) => {
  try {
    let city = req.query.searchQuery;
    // let lat = req.query.lat;
    // let lon = req.query.lon;
  
    // TEST DURING SPECIFIC DATA FOR LAB 7 ----------------------------------------
    if (city !== 'Seattle' && city !== 'Paris' && city !== 'Amman') {
      next(error);
    } else {
      let selectedCity = weather.find(name => name.city_name === city);
      let dataToSend = [];
      selectedCity.data.forEach(day => dataToSend.push(new Forecast(day)));
      res.send(dataToSend);
    }
  } catch (error) {
    next(error);
  }
});

// ERRORS
app.use((error, req, res, next) => {
  res.status(500).send(error.message);
});

// CLASSES
class Forecast {
  constructor(forecastObj) {
    this.date = forecastObj.valid_date;
    this.description = forecastObj.weather.description;
  }
}

// LISTEN
app.listen(PORT, () => console.log(`listening on port ${PORT}`))