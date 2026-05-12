const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });

console.log("👉 MONGO URI:", process.env.MONGODB_URI);

const Movie = require('../models/Movie');
const Show = require('../models/Show');
const { movies } = require('../data/dummyMovies');
const { shows } = require('../data/dummyShows');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing movies and shows
    await Movie.deleteMany({});
    await Show.deleteMany({});

    // Insert dummy movies
    const insertedMovies = await Movie.insertMany(movies);

    // Create shows with movie references
    const showsWithMovies = shows.map((show, index) => {
      // Distribute shows across movies (each movie gets 2 shows)
      const movieIndex = Math.floor(index / 2) % insertedMovies.length;
      return {
        ...show,
        movieId: insertedMovies[movieIndex]._id,
      };
    });

    // Insert shows
    await Show.insertMany(showsWithMovies);

    console.log('✅ Database seeded successfully!');
    console.log(`   📽️  ${insertedMovies.length} movies inserted`);
    console.log(`   🎬 ${showsWithMovies.length} shows inserted`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();