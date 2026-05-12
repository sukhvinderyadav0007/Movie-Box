const Movie = require('../models/Movie');

// Get all movies
exports.getAllMovies = async (req, res, next) => {
  try {
    const { status, genre, language, search } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (genre) filter.genre = genre;
    if (language) filter.language = language;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const movies = await Movie.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    next(error);
  }
};

// Get single movie
exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({
      success: true,
      movie,
    });
  } catch (error) {
    next(error);
  }
};

// Create movie (Admin only)
exports.createMovie = async (req, res, next) => {
  try {
    const {
      title,
      description,
      genre,
      duration,
      releaseDate,
      posterUrl,
      language,
      status,
    } = req.body;

    const movie = new Movie({
      title,
      description,
      genre,
      duration,
      releaseDate,
      posterUrl,
      language,
      status,
    });

    await movie.save();

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      movie,
    });
  } catch (error) {
    next(error);
  }
};

// Update movie (Admin only)
exports.updateMovie = async (req, res, next) => {
  try {
    let movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      movie,
    });
  } catch (error) {
    next(error);
  }
};

// Delete movie (Admin only)
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Search movies
exports.searchMovies = async (req, res, next) => {
  try {
    const { query } = req.query;

    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { genre: { $in: [new RegExp(query, 'i')] } },
      ],
    });

    res.status(200).json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    next(error);
  }
};
