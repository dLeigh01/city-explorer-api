'use strict'

const axios = require('axios');

async function getWeather (req, res, next) {
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
}

class Forecast {
  constructor(forecastObj) {
    this.date = forecastObj.valid_date;
    this.description = forecastObj.weather.description;
    this.low = forecastObj.low_temp;
    this.high = forecastObj.max_temp;
  }
}

module.exports = getWeather;