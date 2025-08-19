import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { moviesAPI } from '../services/api';

const MovieCard = ({ movie, variant = 'default' }) => {
  const { user } = useAuthStore();

  const handleAddToWatchlist = async () => {
    if (!user) return;
    try {
      await moviesAPI.addToWatchlist(movie._id);
      // You could add a toast notification here
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const baseClasses = {
    default: 'w-48 sm:w-56 md:w-64 lg:w-72',
    featured: 'w-64 sm:w-72 md:w-80 lg:w-96',
    trending: 'w-40 sm:w-48 md:w-56 lg:w-64'
  };

  const cardClasses = baseClasses[variant];

  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        y: -10,
        transition: { duration: 0.2 }
      }}
      className={`${cardClasses} group cursor-pointer`}
    >
      <Link to={`/movie/${movie._id}`}>
        <div className="relative overflow-hidden rounded-lg">
          {/* Movie Poster */}
          <img
            src={movie.posterPath || 'https://via.placeholder.com/300x450/333/666?text=No+Image'}
            alt={movie.title}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Movie Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-lg font-bold mb-2 line-clamp-2">{movie.title}</h3>
            {movie.releaseYear && (
              <p className="text-sm text-gray-300 mb-2">{movie.releaseYear}</p>
            )}
            {movie.rating && movie.rating.average && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400">★</span>
                <span className="text-sm">{movie.rating.average.toFixed(1)}</span>
              </div>
            )}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {movie.genres.slice(0, 2).map((genre, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-netflix-red/80 text-white text-xs rounded"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-300 line-clamp-3">{movie.overview}</p>
          </div>

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
            </div>
          </div>
        </div>
      </Link>

      {/* Quick Actions */}
      {user && (
        <div className="mt-2 flex justify-between items-center">
          <button
            onClick={handleAddToWatchlist}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            + Watchlist
          </button>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400">HD</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400">4K</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MovieCard;
