const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user watchlist
router.get('/watchlist', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('watchlist', 'title posterPath backdropPath releaseDate genres rating');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.watchlist);
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user watch history
router.get('/watch-history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('watchHistory.movie', 'title posterPath backdropPath releaseDate genres rating');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.watchHistory);
  } catch (error) {
    console.error('Get watch history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('watchHistory.movie', 'genres');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's preferred genres from watch history
    const genreCounts = {};
    user.watchHistory.forEach(history => {
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
    
    const Movie = require('../models/Movie');
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

// Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { favoriteGenres, language, contentRating } = req.body;
    
    const updateData = {};
    if (favoriteGenres) updateData.favoriteGenres = favoriteGenres;
    if (language) updateData.language = language;
    if (contentRating) updateData.contentRating = contentRating;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Preferences updated successfully',
      user
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user account
router.delete('/account', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
