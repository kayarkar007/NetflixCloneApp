const mongoose = require('mongoose');
const omdbService = require('../services/omdbService');
const Movie = require('../models/Movie');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Clear existing movies
    await Movie.deleteMany({});
    console.log('Cleared existing movies');

    // Get popular movies from OMDB
    console.log('Fetching popular movies from OMDB...');
    const popularMovies = await omdbService.getPopularMovies();
    
    // Get trending movies from OMDB
    console.log('Fetching trending movies from OMDB...');
    const trendingMovies = await omdbService.getTrendingMovies();

    // Combine and deduplicate movies
    const allMovies = [...popularMovies, ...trendingMovies];
    const uniqueMovies = [];
    const seenIds = new Set();

    for (const movie of allMovies) {
      if (!seenIds.has(movie.imdbID)) {
        seenIds.add(movie.imdbID);
        uniqueMovies.push(movie);
      }
    }

    // Transform and save movies
    console.log(`Saving ${uniqueMovies.length} movies to database...`);
    const savedMovies = [];

    for (let i = 0; i < uniqueMovies.length; i++) {
      const movie = uniqueMovies[i];
      console.log(`Processing ${i + 1}/${uniqueMovies.length}: ${movie.Title}`);
      
      try {
        // Get detailed movie info
        const detailedMovie = await omdbService.getMovieById(movie.imdbID);
        const transformedMovie = omdbService.transformOMDBToMovie(detailedMovie);
        
        // Mark some as featured/trending
        if (i < 8) {
          transformedMovie.featured = true;
        }
        if (i < 6) {
          transformedMovie.trending = true;
        }

        // Add some additional fields for our schema
        transformedMovie.formattedRuntime = `${transformedMovie.runtime} min`;
        transformedMovie.status = 'Released';
        transformedMovie.budget = 0; // OMDB doesn't provide budget info
        transformedMovie.revenue = transformedMovie.boxOffice ? 
          parseInt(transformedMovie.boxOffice.replace(/[$,]/g, '')) : 0;
        transformedMovie.tagline = '';
        transformedMovie.videoUrl = '';
        transformedMovie.similarMovies = [];

        // Create new movie document
        const newMovie = new Movie(transformedMovie);
        const savedMovie = await newMovie.save();
        savedMovies.push(savedMovie);
        
        console.log(`✓ Saved: ${savedMovie.title}`);
      } catch (error) {
        console.error(`✗ Error saving ${movie.Title}:`, error.message);
      }
    }

    console.log(`\n✅ Successfully saved ${savedMovies.length} movies to database!`);
    console.log('\nFeatured movies:', savedMovies.filter(m => m.featured).map(m => m.title));
    console.log('Trending movies:', savedMovies.filter(m => m.trending).map(m => m.title));

  } catch (error) {
    console.error('Error populating movies:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
});
