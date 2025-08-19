const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  originalTitle: {
    type: String,
    trim: true
  },
  overview: {
    type: String,
    required: true
  },
  tagline: {
    type: String,
    default: ''
  },
  releaseDate: {
    type: Date,
    required: true
  },
  runtime: {
    type: Number,
    required: true
  },
  genres: [{
    type: String,
    required: true
  }],
  director: {
    type: String,
    required: true
  },
  cast: [{
    name: String,
    character: String,
    profilePath: String
  }],
  crew: [{
    name: String,
    job: String,
    department: String
  }],
  posterPath: {
    type: String,
    required: true
  },
  backdropPath: {
    type: String,
    default: null
  },
  trailerUrl: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  contentRating: {
    type: String,
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA', 'Not Rated', 'N/A'],
    default: 'PG-13'
  },
  language: {
    type: String,
    default: 'English'
  },
  country: {
    type: String,
    default: 'United States'
  },
  budget: {
    type: Number,
    default: 0
  },
  revenue: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Released', 'Post Production', 'In Production', 'Planned', 'Canceled'],
    default: 'Released'
  },
  type: {
    type: String,
    enum: ['movie', 'tv', 'documentary'],
    default: 'movie'
  },
  seasons: {
    type: Number,
    default: 0
  },
  episodes: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: Boolean,
    default: false
  },
  tags: [String],
  similarMovies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }]
}, {
  timestamps: true
});

// Index for search functionality
movieSchema.index({
  title: 'text',
  overview: 'text',
  genres: 'text',
  director: 'text',
  cast: 'text'
});

// Virtual for formatted runtime
movieSchema.virtual('formattedRuntime').get(function() {
  const hours = Math.floor(this.runtime / 60);
  const minutes = this.runtime % 60;
  return `${hours}h ${minutes}m`;
});

// Virtual for formatted release year
movieSchema.virtual('releaseYear').get(function() {
  return this.releaseDate.getFullYear();
});

// Ensure virtuals are serialized
movieSchema.set('toJSON', { virtuals: true });
movieSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Movie', movieSchema);
