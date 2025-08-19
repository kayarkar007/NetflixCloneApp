import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { useAuthStore } from '../store/authStore';
import { usersAPI } from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    profilePicture: user?.profilePicture || ''
  });

  const { data: watchlist, isLoading: watchlistLoading } = useQuery(
    'user-watchlist',
    usersAPI.getWatchlist,
    {
      enabled: !!user,
    }
  );

  const { data: watchHistory, isLoading: historyLoading } = useQuery(
    'user-watch-history',
    usersAPI.getWatchHistory,
    {
      enabled: !!user,
    }
  );

  const handleSave = () => {
    updateUser(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      username: user?.username || '',
      profilePicture: user?.profilePicture || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-lg p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 bg-netflix-red rounded-full flex items-center justify-center text-4xl font-bold text-white">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user?.username?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              {isEditing && (
                <input
                  type="text"
                  placeholder="Profile picture URL"
                  value={editForm.profilePicture}
                  onChange={(e) => setEditForm({ ...editForm, profilePicture: e.target.value })}
                  className="mt-2 w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-netflix-red focus:outline-none"
                />
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="text-3xl font-bold bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:border-netflix-red focus:outline-none"
                  />
                  <div className="flex gap-4 justify-center md:justify-start">
                    <button
                      onClick={handleSave}
                      className="netflix-button px-6 py-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="netflix-button-secondary px-6 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{user?.username}</h1>
                  <p className="text-gray-400 mb-4">{user?.email}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-netflix-red text-white rounded-full text-sm font-medium">
                      {user?.subscription} Plan
                    </span>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="netflix-button-secondary px-6 py-2"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Watchlist */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">My Watchlist</h2>
            {watchlistLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-16 h-24 bg-gray-800 rounded animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-800 rounded w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : watchlist && watchlist.length > 0 ? (
              <div className="space-y-3">
                                 {watchlist.slice(0, 5).map((movie) => (
                  <div key={movie._id} className="flex gap-3">
                    <img
                      src={movie.posterPath || 'https://via.placeholder.com/64x96/333/666?text=No+Image'}
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{movie.title}</h3>
                      <p className="text-gray-400 text-sm">{movie.releaseYear}</p>
                    </div>
                  </div>
                ))}
                {watchlist.length > 5 && (
                  <p className="text-gray-400 text-sm text-center mt-4">
                    +{watchlist.length - 5} more items
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Your watchlist is empty</p>
            )}
          </motion.div>

          {/* Watch History */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900 rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Recently Watched</h2>
            {historyLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-16 h-24 bg-gray-800 rounded animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-800 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : watchHistory && watchHistory.length > 0 ? (
              <div className="space-y-3">
                                 {watchHistory.slice(0, 5).map((history) => (
                  <div key={history._id} className="flex gap-3">
                    <img
                      src={history.movie?.posterPath || 'https://via.placeholder.com/64x96/333/666?text=No+Image'}
                      alt={history.movie?.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{history.movie?.title}</h3>
                      <p className="text-gray-400 text-sm">
                        Watched {new Date(history.watchedAt).toLocaleDateString()}
                      </p>
                      {history.progress > 0 && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-netflix-red h-2 rounded-full"
                              style={{ width: `${history.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-gray-400 text-xs mt-1">{history.progress}% complete</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {watchHistory.length > 5 && (
                  <p className="text-gray-400 text-sm text-center mt-4">
                    +{watchHistory.length - 5} more items
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No watch history yet</p>
            )}
          </motion.div>
        </div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gray-900 rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Account Settings</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Subscription</h3>
              <p className="text-gray-400 mb-2">Current Plan: {user?.subscription}</p>
              <button className="netflix-button-secondary px-4 py-2 text-sm">
                Change Plan
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Account Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors">
                  Change Password
                </button>
                <button className="w-full text-left px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
