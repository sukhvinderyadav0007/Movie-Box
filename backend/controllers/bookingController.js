const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Movie = require('../models/Movie');
const User = require('../models/User');
const { generateQRCode } = require('../utils/helpers');
const { sendEmail } = require('../utils/emailService');
const { getMovieRecommendations } = require('../utils/mlService');

// Create booking
exports.createBooking = async (req, res, next) => {
  try {
    const { showId, seats, numberOfTickets, pricePerTicket } = req.body;

    // Find show
    const show = await Show.findById(showId).populate('movieId');
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    // Verify seats availability
    const bookedSeats = show.bookedSeats.map((s) => s.seatNumber);
    const unavailableSeats = seats.filter((seat) =>
      bookedSeats.includes(seat)
    );

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: `Seats ${unavailableSeats.join(', ')} are already booked`,
      });
    }

    // Check available seats
    if (show.availableSeats < numberOfTickets) {
      return res.status(400).json({ message: 'Not enough available seats' });
    }

    const totalPrice = numberOfTickets * pricePerTicket;

    // Create booking
    const booking = new Booking({
      userId: req.userId,
      movieId: show.movieId._id,
      showId,
      seats,
      numberOfTickets,
      totalPrice,
      pricePerTicket,
      movieTitle: show.movieId.title,
      showTime: show.startTime,
      screenNumber: show.screen,
      status: 'pending',
      paymentStatus: 'pending',
    });

    // Generate QR code
    booking.qrCode = generateQRCode(
      booking._id,
      show.movieId.title,
      show.startTime,
      seats
    );

    await booking.save();

    // Update show booked seats
    seats.forEach((seat) => {
      show.bookedSeats.push({
        seatNumber: seat,
        bookedBy: req.userId,
        bookingId: booking._id,
      });
    });

    show.availableSeats -= numberOfTickets;
    show.occupancyRate = (
      ((show.totalSeats - show.availableSeats) / show.totalSeats) *
      100
    ).toFixed(2);

    await show.save();

    // Add booking to user's history
    await User.findByIdAndUpdate(req.userId, {
      $push: { bookingHistory: booking._id },
    });

    // Update movie total bookings
    await Movie.findByIdAndUpdate(show.movieId._id, {
      $inc: { totalBookings: numberOfTickets },
    });

    // Send mock email
    const user = await User.findById(req.userId);
    await sendEmail(
      user.email,
      'Booking Confirmation',
      `Your booking for ${show.movieId.title} has been created. Reference: ${booking.bookingReference}`
    );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Confirm booking (payment successful)
exports.confirmBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: 'Not authorized to confirm this booking' });
    }

    booking.status = 'confirmed';
    booking.paymentStatus = 'completed';
    booking.confirmedAt = new Date();

    await booking.save();

    // Send confirmation email
    const user = await User.findById(req.userId);
    await sendEmail(
      user.email,
      'Booking Confirmed',
      `Your booking ${booking.bookingReference} is confirmed. Check your QR code for entry.`
    );

    res.status(200).json({
      success: true,
      message: 'Booking confirmed successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel booking
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Release seats
    const show = await Show.findById(booking.showId);
    show.bookedSeats = show.bookedSeats.filter(
      (seat) => !booking.seats.includes(seat.seatNumber)
    );
    show.availableSeats += booking.numberOfTickets;
    await show.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get user bookings
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.userId })
      .populate('movieId')
      .populate('showId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// Get booking by ID
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movieId')
      .populate('showId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: 'Not authorized to view this booking' });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Get recommendations for user
exports.getRecommendations = async (req, res, next) => {
  try {
    // Get user's booking history
    const user = await User.findById(req.userId).populate('bookingHistory');
    const movieIds = user.bookingHistory.map((b) => b.movieId.toString());

    // Get ML recommendations
    const recommendations = await getMovieRecommendations(
      req.userId,
      movieIds
    );

    if (!recommendations) {
      // Fallback: get popular movies
      const popularMovies = await Movie.find({ status: 'now-showing' })
        .sort({ popularity: -1 })
        .limit(5);

      return res.status(200).json({
        success: true,
        recommendations: popularMovies,
      });
    }

    res.status(200).json({
      success: true,
      recommendations: recommendations.recommended_movies || [],
    });
  } catch (error) {
    next(error);
  }
};
