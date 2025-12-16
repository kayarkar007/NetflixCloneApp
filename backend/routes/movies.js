const express = require('express');
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');
const omdbService = require('../services/omdbService');

const router = express.Router();

// Get all movies with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      genre,
      type,
      search,
      sortBy = 'releaseDate',
      order = 'desc'
    } = req.query;

    // If search query is provided, use OMDB
    if (search && search.trim()) {
      try {
        const omdbMovies = await omdbService.searchMovies(search.trim());
        const transformedMovies = omdbMovies.map(movie => omdbService.transformOMDBToMovie(movie));
        
        res.json({
          movies: transformedMovies,
          totalPages: 1,
          currentPage: 1,
          total: transformedMovies.length
        });
        return;
      } catch (omdbError) {
        console.error('OMDB search error:', omdbError);
        // Fall back to database search
      }
    }

    const query = {};

    // Filter by genre
    if (genre) {
      query.genres = { $in: genre.split(',') };
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = order === 'desc' ? -1 : 1;

    const movies = await Movie.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-videoUrl');

    const total = await Movie.countDocuments(query);

    res.json({
      movies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured movies
router.get('/featured', async (req, res) => {
  try {
    // Try to get from database first
    let movies = await Movie.find({ featured: true })
      .sort({ releaseDate: -1 })
      .limit(10)
      .select('-videoUrl');

    // If no featured movies in database, get from OMDB
    if (!movies || movies.length === 0) {
      movies = await omdbService.getPopularMovies();
      // Transform OMDB data to our format
      movies = movies.map(movie => omdbService.transformOMDBToMovie(movie));
    }

    res.json(movies);
  } catch (error) {
    console.error('Get featured movies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trending movies
router.get('/trending', async (req, res) => {
  try {
    // Try to get from database first
    let movies = await Movie.find({ trending: true })
      .sort({ 'rating.average': -1 })
      .limit(10)
      .select('-videoUrl');

    // If no trending movies in database, get from OMDB
    if (!movies || movies.length === 0) {
      movies = await omdbService.getTrendingMovies();
      // Transform OMDB data to our format
      movies = movies.map(movie => omdbService.transformOMDBToMovie(movie));
    }

    res.json(movies);
  } catch (error) {
    console.error('Get trending movies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get movies by genre
router.get('/genre/:genre', async (req, res) => {
  try {
    const { genre } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Try to get from database first
    let movies = await Movie.find({ genres: { $in: [genre] } })
      .sort({ releaseDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-videoUrl');

    // If no movies in database for this genre, get from OMDB
    if (!movies || movies.length === 0) {
      movies = await omdbService.getMoviesByGenre(genre);
      // Transform OMDB data to our format
      movies = movies.map(movie => omdbService.transformOMDBToMovie(movie));
    }

    const total = movies.length;

    res.json({
      movies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get movies by genre error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate('similarMovies', 'title posterPath releaseDate');

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add movie to watchlist (authenticated)
router.post('/:id/watchlist', auth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const User = require('../models/User');
    const user = await User.findById(req.user.userId);

    if (user.watchlist.includes(req.params.id)) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }

    user.watchlist.push(req.params.id);
    await user.save();

    res.json({ message: 'Added to watchlist' });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove movie from watchlist (authenticated)
router.delete('/:id/watchlist', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.userId);

    user.watchlist = user.watchlist.filter(
      movieId => movieId.toString() !== req.params.id
    );
    await user.save();

    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update watch history (authenticated)
router.post('/:id/watch-history', auth, async (req, res) => {
  try {
    const { progress } = req.body;
    const User = require('../models/User');
    
    const user = await User.findById(req.user.userId);
    const existingHistory = user.watchHistory.find(
      history => history.movie.toString() === req.params.id
    );

    if (existingHistory) {
      existingHistory.progress = progress;
      existingHistory.watchedAt = new Date();
    } else {
      user.watchHistory.push({
        movie: req.params.id,
        progress,
        watchedAt: new Date()
      });
    }

    await user.save();
    res.json({ message: 'Watch history updated' });
  } catch (error) {
    console.error('Update watch history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get movie recommendations (authenticated)
router.get('/recommendations', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.userId)
      .populate('watchHistory.movie', 'genres');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's preferred genres from watch history
    const genreCounts = {};
    (user.watchHistory || []).forEach(history => {
      if (history.movie && history.movie.genres) {
        history.movie.genres.forEach(genre => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    });

    // Get top genres
    const topGenres = Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);

    // Find movies in top genres that user hasn't watched
    const watchedMovieIds = user.watchHistory.map(h => h.movie._id);
    
    const recommendations = await Movie.find({
      genres: { $in: topGenres },
      _id: { $nin: watchedMovieIds }
    })
      .sort({ 'rating.average': -1 })
      .limit(10)
      .select('-videoUrl');

    res.json(recommendations);
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
