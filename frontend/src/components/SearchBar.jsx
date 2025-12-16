import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ 
  placeholder = "Search for movies, TV shows...", 
  onSearch,
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // mockSuggestions moved to module scope below

  useEffect(() => {
    if (query.trim()) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/browse?search=${encodeURIComponent(query.trim())}`);
      }
      setQuery('');
      setIsExpanded(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    if (onSearch) {
      onSearch(suggestion);
    } else {
      navigate(`/browse?search=${encodeURIComponent(suggestion)}`);
    }
    setIsExpanded(false);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsExpanded(false);
  };

  return (
    <div className={`relative ${className}`}>
      <motion.form
        onSubmit={handleSubmit}
        className="relative"
        initial={false}
        animate={{ width: isExpanded ? '100%' : 'auto' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="relative flex items-center">
          <motion.div
            initial={false}
            animate={{ 
              width: isExpanded ? '100%' : '48px',
              borderRadius: isExpanded ? '9999px' : '50%'
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-600 flex items-center"
          >
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className={`p-3 text-gray-300 hover:text-white transition-colors ${
                isExpanded ? 'hidden' : 'block'
              }`}
            >
              <FiSearch className="w-5 h-5" />
            </button>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '100%', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="flex items-center w-full"
                >
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-transparent text-white placeholder-gray-400 px-4 py-3 outline-none"
                    autoFocus
                    onBlur={() => {
                      if (!query.trim()) {
                        setTimeout(() => setIsExpanded(false), 200);
                      }
                    }}
                  />
                  
                  {query && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    className="p-3 text-gray-300 hover:text-white transition-colors"
                  >
                    <FiSearch className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.form>

      {/* Search Suggestions */}
      <AnimatePresence>
        {isExpanded && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-sm rounded-lg border border-gray-600 shadow-xl z-50"
          >
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FiSearch className="w-4 h-4 text-gray-500" />
                    <span>{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;

// Module-scope mock suggestions to avoid recreating array and to satisfy eslint hook dependency
const mockSuggestions = [
  'Action movies',
  'Comedy shows',
  'Drama series',
  'Horror films',
  'Romance movies',
  'Sci-fi series',
  'Thriller movies',
  'Documentaries'
];
