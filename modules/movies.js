'use strict'

let cache = require('./cache.js');
const axios = require('axios');

async function getMovies (req, res, next){
  const key = 'moviedb-' + req.query.searchQuery;
  
  if (cache[key] && ((Date.now() - cache[key].timestamp) < (1000 * 60 * 60 * 24 * 30))) {
    try {
      let city = req.query.searchQuery;
      let movies = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIEDB_KEY}&language=en-US&query=${city}&include_adult=false`);
      let dataToSend = [];

      movies.data.results.forEach(movie => dataToSend.push(new Movie(movie)));
      res.send(dataToSend);
    } catch (error) {
      next(error);
    }
  } else {
    try {
      let city = req.query.searchQuery;
      let movies = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIEDB_KEY}&language=en-US&query=${city}&include_adult=false`);
      let dataToSend = [];

      movies.data.results.forEach(movie => dataToSend.push(new Movie(movie)));
      cache[key] = {};
      cache[key].timestamp = Date.now();
      cache[key].data = dataToSend;
      res.send(dataToSend);
    } catch (error) {
      next(error);
    }
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

module.exports = getMovies;