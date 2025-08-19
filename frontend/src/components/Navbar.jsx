import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { authAPI } from '../services/api';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      logout();
      navigate('/');
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-netflix-red"
          >
            NETFLIX
          </motion.div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link
                to="/browse"
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                Browse
              </Link>
              <Link
                to="/profile"
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="netflix-button"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Profile Menu */}
        {isAuthenticated && (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-netflix-red rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <span className="hidden md:block">{user?.username}</span>
            </button>

            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50"
              >
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                >
                  Sign Out
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
