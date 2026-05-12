const express = require('express');
const {
  createBooking,
  confirmBooking,
  cancelBooking,
  getUserBookings,
  getBookingById,
  getRecommendations,
} = require('../controllers/bookingController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createBooking);
router.put('/:id/confirm', auth, confirmBooking);
router.delete('/:id/cancel', auth, cancelBooking);
router.get('/user/bookings', auth, getUserBookings);
router.get('/recommendations', auth, getRecommendations);
router.get('/:id', auth, getBookingById);

module.exports = router;
