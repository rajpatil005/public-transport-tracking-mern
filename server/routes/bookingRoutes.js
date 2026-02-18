const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  checkAvailability
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.post('/check-availability', protect, checkAvailability);
router.get('/my-bookings', protect, getMyBookings);

router.route('/')
  .post(protect, createBooking);

router.route('/:id')
  .get(protect, getBookingById)
  .put(protect, cancelBooking);

module.exports = router;