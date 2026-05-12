const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: true,
    },
    seats: [
      {
        type: String,
        required: true,
      },
    ],
    numberOfTickets: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    pricePerTicket: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    qrCode: {
      type: String,
    },
    bookingReference: {
      type: String,
      unique: true,
    },
    movieTitle: String,
    showTime: Date,
    screenNumber: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    confirmedAt: Date,
  },
  { timestamps: true }
);

// Generate booking reference before saving
BookingSchema.pre('save', function (next) {
  if (!this.bookingReference) {
    this.bookingReference =
      'BK' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
