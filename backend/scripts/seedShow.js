const mongoose = require('mongoose');
const Show = require('../models/Show');
const Movie = require('../models/Movie');
require('dotenv').config({ path: __dirname + '/../.env' });

const seedShows = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const movies = await Movie.find();

    if (movies.length === 0) {
      console.log('No movies found!');
      process.exit(1);
    }

    await Show.deleteMany({});

    const shows = movies.map((movie) => ({
      movie: movie._id,
      theater: 'PVR Cinemas',
      showTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours later
      price: 200,
      totalSeats: 50,
      bookedSeats: [],
    }));

    await Show.insertMany(shows);

    console.log('Shows seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedShows();