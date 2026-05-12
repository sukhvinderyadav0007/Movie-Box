const express = require('express');
const {
  getAnalytics,
  getAllUsers,
  getAllBookings,
  getAllShows,
  updateUserRole,
  deleteUser,
  getBookingAnalytics,
} = require('../controllers/adminController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin authentication
router.use(auth, adminAuth);

router.get('/analytics', getAnalytics);
router.get('/booking-analytics', getBookingAnalytics);
router.get('/users', getAllUsers);
router.get('/bookings', getAllBookings);
router.get('/shows', getAllShows);
router.put('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);

module.exports = router;
