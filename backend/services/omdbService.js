const axios = require('axios');

const OMDB_API_KEY = process.env.OMDB_API_KEY || 'ceb20a0c';
const OMDB_BASE_URL = process.env.OMDB_BASE_URL || 'http://www.omdbapi.com';

class OMDBService {
  constructor() {
    this.apiKey = OMDB_API_KEY;
    this.baseURL = OMDB_BASE_URL;
  }

  // Search movies by title
  async searchMovies(query, type = 'movie', year = '') {
    try {
      const params = {
        s: query,
        type: type,
        y: year,
        apikey: this.apiKey
      };

      const response = await axios.get(this.baseURL, { params });
      
      if (response.data.Response === 'False') {
        throw new Error(response.data.Error || 'No movies found');
      }

      return response.data.Search || [];
    } catch (error) {
      console.error('OMDB search error:', error);
      throw error;
    }
  }

  // Get movie details by IMDB ID
  async getMovieById(imdbId) {
    try {
      const params = {
        i: imdbId,
        apikey: this.apiKey
      };

      const response = await axios.get(this.baseURL, { params });
      
      if (response.data.Response === 'False') {
        throw new Error(response.data.Error || 'Movie not found');
      }

      return response.data;
    } catch (error) {
      console.error('OMDB get movie error:', error);
      throw error;
    }
  }

  // Get popular movies (using search with common terms)
  async getPopularMovies() {
    try {
      const popularTerms = [
        'Avengers', 'Batman', 'Spider-Man', 'Star Wars', 'Jurassic Park',
        'Mission Impossible', 'Fast and Furious', 'Transformers', 'Iron Man',
        'Captain America', 'Wonder Woman', 'Black Panther', 'Thor', 'Deadpool'
      ];

      const movies = [];
      const seenIds = new Set();

      for (const term of popularTerms.slice(0, 6)) {
        try {
          const searchResults = await this.searchMovies(term, 'movie', '');
          for (const movie of searchResults) {
            if (!seenIds.has(movie.imdbID) && movies.length < 15) {
              seenIds.add(movie.imdbID);
              movies.push(movie);
            }
          }
        } catch (error) {
          console.error(`Error searching for ${term}:`, error);
        }
      }

      return movies;
    } catch (error) {
      console.error('OMDB get popular movies error:', error);
      throw error;
    }
  }

  // Get trending movies (recent releases)
  async getTrendingMovies() {
    try {
      const currentYear = new Date().getFullYear();
      const trendingTerms = [
        '2024', '2023', 'Marvel', 'DC', 'Disney', 'Pixar'
      ];

      const movies = [];
      const seenIds = new Set();

      for (const term of trendingTerms.slice(0, 4)) {
        try {
          const searchResults = await this.searchMovies(term, 'movie', '');
          for (const movie of searchResults) {
            if (!seenIds.has(movie.imdbID) && movies.length < 10) {
              seenIds.add(movie.imdbID);
              movies.push(movie);
            }
          }
        } catch (error) {
          console.error(`Error searching for ${term}:`, error);
        }
      }

      return movies;
    } catch (error) {
      console.error('OMDB get trending movies error:', error);
      throw error;
    }
  }

  // Get movies by genre
  async getMoviesByGenre(genre) {
    try {
      const genreTerms = {
        'Action': ['action', 'adventure', 'superhero'],
        'Comedy': ['comedy', 'funny', 'humor'],
        'Drama': ['drama', 'emotional', 'serious'],
        'Horror': ['horror', 'scary', 'thriller'],
        'Romance': ['romance', 'love', 'romantic'],
        'Sci-Fi': ['sci-fi', 'science fiction', 'space'],
        'Animation': ['animation', 'animated', 'cartoon']
      };

      const searchTerms = genreTerms[genre] || [genre.toLowerCase()];
      const movies = [];
      const seenIds = new Set();

      for (const term of searchTerms.slice(0, 3)) {
        try {
          const searchResults = await this.searchMovies(term, 'movie', '');
          for (const movie of searchResults) {
            if (!seenIds.has(movie.imdbID) && movies.length < 12) {
              seenIds.add(movie.imdbID);
              movies.push(movie);
            }
          }
        } catch (error) {
          console.error(`Error searching for ${term}:`, error);
        }
      }

      return movies;
    } catch (error) {
      console.error('OMDB get movies by genre error:', error);
      throw error;
    }
  }

  // Transform OMDB data to our movie format
  transformOMDBToMovie(omdbData) {
    // Handle runtime parsing more carefully
    let runtime = 120; // default
    if (omdbData.Runtime && omdbData.Runtime !== 'N/A') {
      const runtimeMatch = omdbData.Runtime.match(/(\d+)/);
      if (runtimeMatch) {
        runtime = parseInt(runtimeMatch[1]);
      }
    }

    // Handle content rating
    let contentRating = 'PG-13'; // default
    if (omdbData.Rated && omdbData.Rated !== 'N/A') {
      contentRating = omdbData.Rated;
    }

    // Provide a default backdrop image (using a placeholder service)
    const backdropPath = 'https://via.placeholder.com/1920x1080/1a1a1a/ffffff?text=Movie+Backdrop';

    return {
      title: omdbData.Title,
      overview: omdbData.Plot || 'No plot available',
      releaseYear: parseInt(omdbData.Year) || new Date().getFullYear(),
      releaseDate: new Date(parseInt(omdbData.Year) || new Date().getFullYear(), 0, 1),
      runtime: runtime,
      genres: omdbData.Genre ? omdbData.Genre.split(', ') : [],
      director: omdbData.Director || 'Unknown',
      cast: omdbData.Actors ? omdbData.Actors.split(', ').map(actor => ({
        name: actor.trim(),
        character: 'Unknown'
      })) : [],
      posterPath: omdbData.Poster !== 'N/A' ? omdbData.Poster : 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster',
      backdropPath: backdropPath,
      contentRating: contentRating,
      language: omdbData.Language ? omdbData.Language.split(', ')[0] : 'English',
      country: omdbData.Country || 'Unknown',
      imdbId: omdbData.imdbID,
      rating: {
        average: parseFloat(omdbData.imdbRating) || 0,
        count: parseInt(omdbData.imdbVotes?.replace(/,/g, '')) || 0
      },
      boxOffice: omdbData.BoxOffice !== 'N/A' ? omdbData.BoxOffice : null,
      awards: omdbData.Awards !== 'N/A' ? omdbData.Awards : null,
      featured: false,
      trending: false
    };
  }
}

module.exports = new OMDBService();
