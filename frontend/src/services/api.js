import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Movie API calls
export const movieAPI = {
  getAllMovies: (filters) => api.get('/movies', { params: filters }),
  getMovieById: (id) => api.get(`/movies/${id}`),
  createMovie: (data) => api.post('/movies', data),
  updateMovie: (id, data) => api.put(`/movies/${id}`, data),
  deleteMovie: (id) => api.delete(`/movies/${id}`),
  searchMovies: (query) => api.get('/movies/search', { params: { query } }),
};

// Show API calls
export const showAPI = {
  getAllShows: () => api.get('/shows'),
  getShowsByMovie: (movieId) => api.get(`/shows/movie/${movieId}`),
  getShowById: (id) => api.get(`/shows/${id}`),
  createShow: (data) => api.post('/shows', data),
  updateShow: (id, data) => api.put(`/shows/${id}`, data),
  deleteShow: (id) => api.delete(`/shows/${id}`),
};

// Booking API calls
export const bookingAPI = {
  createBooking: (data) => api.post('/bookings', data),
  confirmBooking: (id) => api.put(`/bookings/${id}/confirm`),
  cancelBooking: (id) => api.delete(`/bookings/${id}/cancel`),
  getUserBookings: () => api.get('/bookings/user/bookings'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  getRecommendations: () => api.get('/bookings/recommendations'),
};

// Admin API calls
export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
  getBookingAnalytics: () => api.get('/admin/booking-analytics'),
  getAllUsers: () => api.get('/admin/users'),
  getAllBookings: () => api.get('/admin/bookings'),
  getAllShows: () => api.get('/admin/shows'),
  updateUserRole: (userId, role) =>
    api.put(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
};

export default api;
