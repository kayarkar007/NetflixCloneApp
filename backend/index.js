const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const userRoutes = require('./routes/users');

const app = express();
// If running behind a proxy (e.g., Docker, reverse proxy), trust proxy headers
// Only trust loopback proxy headers in development to avoid allowing external spoofing
app.set('trust proxy', 'loopback');
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
// Allow requests from the deployed frontend or common dev origins (3000 for CRA, 5173 for Vite)
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:3000', 'http://localhost:5173'].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: Origin not allowed'), false);
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Netflix Clone API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/netflix-clone', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  console.warn('Starting server without a database connection (development only).');
  // Start the server anyway so frontend and non-db routes can be tested during development.
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (no DB connection)`);
  });
});
