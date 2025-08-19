import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { moviesAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const { data: movie, isLoading, error } = useQuery(
    ['movie', id],
         () => moviesAPI.getById(id),
    {
      enabled: !!id,
    }
  );

  const handleAddToWatchlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isInWatchlist) {
                 await moviesAPI.removeFromWatchlist(id);
        setIsInWatchlist(false);
      } else {
                 await moviesAPI.addToWatchlist(id);
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.error('Watchlist error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="w-full h-96 bg-gray-800 rounded-lg mb-6"></div>
            <div className="w-1/3 h-8 bg-gray-800 rounded mb-4"></div>
            <div className="w-2/3 h-4 bg-gray-800 rounded mb-2"></div>
            <div className="w-1/2 h-4 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Movie not found</h1>
          <button
            onClick={() => navigate('/browse')}
            className="netflix-button"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Hero Section */}
      <div 
        className="relative h-96 md:h-[70vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(${movie.backdropPath || 'https://via.placeholder.com/1920x1080/333/666?text=No+Image'})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-16">
          <div className="max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-white mb-4 text-shadow-lg"
            >
              {movie.title}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 text-gray-300 mb-6"
            >
              <span className="text-lg">{movie.releaseYear}</span>
              <span className="text-lg">{movie.formattedRuntime}</span>
              <span className="px-2 py-1 bg-gray-800 rounded text-sm">
                {movie.contentRating}
              </span>
              <span className="text-lg">{movie.genres?.join(', ')}</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-300 mb-8 max-w-2xl"
            >
              {movie.overview}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <button className="netflix-button text-lg px-8 py-3">
                ▶ Play
              </button>
              <button
                onClick={handleAddToWatchlist}
                className={`netflix-button-secondary text-lg px-8 py-3 ${
                  isInWatchlist ? 'bg-white text-black' : ''
                }`}
              >
                {isInWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Movie Details */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Cast & Crew */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Cast & Crew</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                 {movie.cast?.slice(0, 6).map((actor, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-2"></div>
                    <p className="text-white text-sm font-medium">{actor.name}</p>
                    <p className="text-gray-400 text-xs">{actor.character}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {movie.similarMovies && movie.similarMovies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4">Similar Movies</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                     {movie.similarMovies.slice(0, 4).map((similarMovie) => (
                    <div
                      key={similarMovie._id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/movie/${similarMovie._id}`)}
                    >
                      <img
                        src={similarMovie.posterPath || 'https://via.placeholder.com/200x300/333/666?text=No+Image'}
                        alt={similarMovie.title}
                        className="w-full h-auto rounded-lg hover:scale-105 transition-transform duration-200"
                      />
                      <p className="text-white text-sm mt-2">{similarMovie.title}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Additional Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Details</h3>
              <div className="space-y-2 text-gray-300">
                <p><span className="text-gray-500">Director:</span> {movie.director}</p>
                <p><span className="text-gray-500">Language:</span> {movie.language}</p>
                <p><span className="text-gray-500">Country:</span> {movie.country}</p>
                <p><span className="text-gray-500">Status:</span> {movie.status}</p>
                {movie.budget > 0 && (
                  <p><span className="text-gray-500">Budget:</span> ${movie.budget.toLocaleString()}</p>
                )}
                {movie.revenue > 0 && (
                  <p><span className="text-gray-500">Revenue:</span> ${movie.revenue.toLocaleString()}</p>
                )}
              </div>
            </div>

            {movie.rating && movie.rating.average && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Rating</h3>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-bold text-yellow-400">
                    {movie.rating.average.toFixed(1)}
                  </div>
                  <div className="text-gray-400">
                    / 10 ({movie.rating.count || 0} votes)
                  </div>
                </div>
              </div>
            )}

            {movie.tagline && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Tagline</h3>
                <p className="text-gray-300 italic">"{movie.tagline}"</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
