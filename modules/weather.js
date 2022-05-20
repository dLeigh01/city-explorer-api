'use strict';

let cache = require('./cache.js');
const axios = require('axios');


function getWeather(lat, lon) {
  const key = 'weather-' + lat + lon;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.WEATHERBIT_KEY}&lang=en&lat=${lat}&lon=${lon}&days=5`;
  
  if (cache[key] && ((Date.now() - cache[key].timestamp) < 50000)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.get(url)
    .then(response => parseWeather(response.data));
  }
  
  return cache[key].data;
}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map(day => {
      return new Weather(day);
    });
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Weather {
  constructor(forecastObj) {
    this.date = forecastObj.valid_date;
    this.description = forecastObj.weather.description;
    this.low = forecastObj.low_temp;
    this.high = forecastObj.max_temp;
  }
}

module.exports = getWeather;