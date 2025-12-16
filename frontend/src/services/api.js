import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('netflix-auth');
    if (token) {
      try {
        const parsed = JSON.parse(token);
        if (parsed.state?.token) {
          config.headers.Authorization = `Bearer ${parsed.state.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('netflix-auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }).then(r => r.data),

  register: (email, password, username) =>
    api.post('/auth/register', { email, password, username }).then(r => r.data),

  getProfile: () => api.get('/auth/profile').then(r => r.data),

  updateProfile: (data) => api.put('/auth/profile', data).then(r => r.data),

  changePassword: (currentPassword, newPassword) =>
    api.put('/auth/change-password', { currentPassword, newPassword }).then(r => r.data),

  logout: () => api.post('/auth/logout').then(r => r.data),
};

// Movies API calls
export const moviesAPI = {
  // returns: { movies: Movie[], totalPages, currentPage, total }
  getAll: (params) => api.get('/movies', { params }).then(r => r.data),

  // returns: Movie[]
  getFeatured: () => api.get('/movies/featured').then(r => r.data),

  // returns: Movie[]
  getTrending: () => api.get('/movies/trending').then(r => r.data),

  // returns: { movies: Movie[], totalPages, currentPage, total }
  getByGenre: (genre, params) =>
    api.get(`/movies/genre/${genre}`, { params }).then(r => r.data),

  // returns: Movie
  getById: (id) => api.get(`/movies/${id}`).then(r => r.data),

  addToWatchlist: (id) => api.post(`/movies/${id}/watchlist`).then(r => r.data),

  removeFromWatchlist: (id) => api.delete(`/movies/${id}/watchlist`).then(r => r.data),

  updateWatchHistory: (id, progress) =>
    api.post(`/movies/${id}/watch-history`, { progress }).then(r => r.data),

  getRecommendations: () => api.get('/movies/recommendations').then(r => r.data),
};

// Users API calls
export const usersAPI = {
  getWatchlist: () => api.get('/users/watchlist').then(r => r.data),

  getWatchHistory: () => api.get('/users/watch-history').then(r => r.data),

  getRecommendations: () => api.get('/users/recommendations').then(r => r.data),

  updatePreferences: (data) => api.put('/users/preferences', data).then(r => r.data),

  deleteAccount: () => api.delete('/users/account').then(r => r.data),
};

export default api;
