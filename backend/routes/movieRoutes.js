const express = require('express');
const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  searchMovies,
} = require('../controllers/movieController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllMovies);
router.get('/search', searchMovies);
router.get('/:id', getMovieById);
router.post('/', auth, adminAuth, createMovie);
router.put('/:id', auth, adminAuth, updateMovie);
router.delete('/:id', auth, adminAuth, deleteMovie);

module.exports = router;
