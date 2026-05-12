const mongoose = require('mongoose');

const ShowSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    screen: {
      type: String,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
      default: 150,
    },
    dynamicPrice: {
      type: Number,
      required: true,
      default: 150,
    },
    totalSeats: {
      type: Number,
      default: 100,
    },
    availableSeats: {
      type: Number,
      default: 100,
    },
    bookedSeats: [
      {
        seatNumber: String,
        bookedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        bookingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Booking',
        },
      },
    ],
    occupancyRate: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Show', ShowSchema);
