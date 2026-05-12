const express = require('express');
const {
  getAllShows,
  getShowsByMovie,
  createShow,
  getShowById,
  updateShow,
  deleteShow,
} = require('../controllers/showController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllShows);
router.get('/movie/:movieId', getShowsByMovie);
router.post('/', auth, adminAuth, createShow);
router.get('/:id', getShowById);
router.put('/:id', auth, adminAuth, updateShow);
router.delete('/:id', auth, adminAuth, deleteShow);

module.exports = router;
