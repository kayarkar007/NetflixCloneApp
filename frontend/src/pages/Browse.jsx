import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { moviesAPI } from '../services/api';
import MovieCard from '../components/MovieCard.jsx';
import SearchBar from '../components/SearchBar.jsx';

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const { data: featuredMoviesRaw, isLoading: featuredLoading } = useQuery(
    'featured-movies',
    moviesAPI.getFeatured
  );

  const { data: trendingMoviesRaw, isLoading: trendingLoading } = useQuery(
    'trending-movies',
    moviesAPI.getTrending
  );

  const { data: searchResultsRaw, isLoading: searchLoading } = useQuery(
    ['search-movies', searchQuery],
    () => moviesAPI.getAll({ search: searchQuery }),
    {
      enabled: searchQuery.length > 0,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery',
    'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western'
  ];



  const asArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (Array.isArray(value.movies)) return value.movies;
    return [];
  };

  const featuredMovies = asArray(featuredMoviesRaw);
  const trendingMovies = asArray(trendingMoviesRaw);
  const searchResults = searchResultsRaw;

  const MovieRow = ({ 
    title, 
    movies, 
    isLoading 
  }) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      {isLoading ? (
        <div className="flex space-x-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-48 h-72 bg-gray-800 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {asArray(movies).map((movie) => (
            <div key={movie._id} className="flex-shrink-0">
              <MovieCard movie={movie} variant="trending" />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96">
              <SearchBar
                placeholder="Search movies and TV shows..."
                onSearch={setSearchQuery}
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(selectedGenre === genre ? '' : genre)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    selectedGenre === genre
                      ? 'bg-netflix-red text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Search Results */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Search Results for "{searchQuery}"
            </h2>
            {searchLoading ? (
              <div className="movies-grid">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="movies-grid">
                {asArray(searchResults)?.map((movie) => (
                   <MovieCard key={movie._id} movie={movie} variant="default" />
                 ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Featured Movies */}
        <MovieRow
          title="Featured Movies"
          movies={featuredMovies || []}
          isLoading={featuredLoading}
        />

        {/* Trending Movies */}
        <MovieRow
          title="Trending Now"
          movies={trendingMovies || []}
          isLoading={trendingLoading}
        />

        {/* Genre-specific content */}
        {selectedGenre && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              {selectedGenre} Movies
            </h2>
            <div className="movies-grid">
              {/* This would be populated with actual genre-specific movies */}
              <div className="text-gray-400 text-center col-span-full py-8">
                Loading {selectedGenre} movies...
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Browse;
