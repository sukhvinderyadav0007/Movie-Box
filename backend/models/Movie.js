const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a movie title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    genre: [
      {
        type: String,
        enum: [
          'Action',
          'Comedy',
          'Drama',
          'Horror',
          'Romance',
          'Thriller',
          'Sci-Fi',
          'Crime',
            'Adventure',
            'Animation',
            'Fantasy',
            'Documentary',
            'Family',
        ],
      },
    ],
    duration: {
      type: Number, // in minutes
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    posterUrl: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ['English', 'Hindi', 'Spanish', 'French', 'Other'],
      default: 'English',
    },
    status: {
      type: String,
      enum: ['upcoming', 'now-showing', 'archived'],
      default: 'upcoming',
    },
    popularity: {
      type: Number,
      default: 0,
    },
    totalBookings: {
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

module.exports = mongoose.model('Movie', MovieSchema);
