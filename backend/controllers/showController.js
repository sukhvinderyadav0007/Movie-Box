const Show = require('../models/Show');
const Movie = require('../models/Movie');
const { predictDemand, getDynamicPrice } = require('../utils/mlService');

// Get all shows
exports.getAllShows = async (req, res, next) => {
  try {
    const shows = await Show.find()
      .populate('movieId')
      .sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      count: shows.length,
      shows,
    });
  } catch (error) {
    next(error);
  }
};

// Get shows by movie
exports.getShowsByMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const shows = await Show.find({ movieId }).sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      count: shows.length,
      shows,
    });
  } catch (error) {
    next(error);
  }
};

// Create show (Admin only)
exports.createShow = async (req, res, next) => {
  try {
    const { movieId, startTime, endTime, screen, basePrice, totalSeats } =
      req.body;

    // Verify movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Get predicted demand
    const demandData = await predictDemand(movieId, startTime, 
      new Date(startTime).toTimeString());

    let dynamicPrice = basePrice;
    if (demandData && demandData.predicted_demand) {
      const priceData = await getDynamicPrice(
        demandData.predicted_demand,
        basePrice
      );
      dynamicPrice = priceData?.dynamic_price || basePrice;
    }

    const show = new Show({
      movieId,
      startTime,
      endTime,
      screen,
      basePrice,
      dynamicPrice,
      totalSeats,
      availableSeats: totalSeats,
    });

    await show.save();

    res.status(201).json({
      success: true,
      message: 'Show created successfully',
      show,
    });
  } catch (error) {
    next(error);
  }
};

// Get show by ID
exports.getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id).populate('movieId');

    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    res.status(200).json({
      success: true,
      show,
    });
  } catch (error) {
    next(error);
  }
};

// Update show (Admin only)
exports.updateShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Show updated successfully',
      show,
    });
  } catch (error) {
    next(error);
  }
};

// Delete show (Admin only)
exports.deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);

    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Show deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
