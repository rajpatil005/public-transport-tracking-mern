const Booking = require('../models/Booking');
const QRCode = require('qrcode');

// @desc    Create booking
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { busId, routeId, seats, travelDate, departureTime, totalFare } = req.body;

    // Create booking
    const booking = await Booking.create({
      userId: req.user.id,
      busId,
      routeId,
      seats,
      travelDate,
      departureTime,
      totalFare,
      status: 'confirmed'
    });

    // Generate QR Code
    const qrData = JSON.stringify({
      bookingId: booking.bookingId,
      busId,
      seats: seats.map(s => s.seatNumber),
      travelDate,
      departureTime
    });

    const qrCode = await QRCode.toDataURL(qrData);
    booking.qrCode = qrCode;
    await booking.save();

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('busId', 'busNumber busType')
      .populate('routeId', 'routeNumber name source destination')
      .sort({ bookingDate: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('busId')
      .populate('routeId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking or is admin
    if (booking.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Check if travel date is in future
    if (new Date(booking.travelDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel past bookings'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check seat availability
// @route   POST /api/bookings/check-availability
exports.checkAvailability = async (req, res) => {
  try {
    const { busId, travelDate } = req.body;

    // Get all confirmed bookings for that bus and date
    const bookings = await Booking.find({
      busId,
      travelDate: new Date(travelDate),
      status: 'confirmed'
    });

    // Get all booked seats
    const bookedSeats = bookings.flatMap(booking => 
      booking.seats.map(s => s.seatNumber)
    );

    // Get bus capacity
    const bus = await Bus.findById(busId);
    const totalSeats = bus.capacity;

    // Generate available seats
    const availableSeats = [];
    for (let i = 1; i <= totalSeats; i++) {
      availableSeats.push({
        number: i,
        available: !bookedSeats.includes(i)
      });
    }

    res.json({
      success: true,
      data: {
        totalSeats,
        bookedSeats: bookedSeats.length,
        availableSeats: availableSeats.filter(s => s.available).length,
        seats: availableSeats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};