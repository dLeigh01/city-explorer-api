'use strict'

const axios = require('axios');

async function getMovies (req, res, next){
  try {
    let city = req.query.searchQuery;
    let movies = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIEDB_KEY}&language=en-US&query=${city}&include_adult=false`);
    let dataToSend = [];

    movies.data.results.forEach(movie => dataToSend.push(new Movie(movie)));
    res.send(dataToSend);
  } catch (error) {
    next(error);
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