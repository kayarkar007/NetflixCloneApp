const mongoose = require('mongoose');

// Middleware to ensure MongoDB connection is available before handling requests
module.exports = (req, res, next) => {
  // 1 = connected
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return next();
  }

  console.warn('Database not connected - rejecting request');
  return res.status(503).json({ message: 'Database unavailable, please try again later' });
};
