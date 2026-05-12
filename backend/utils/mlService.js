const axios = require('axios');

const ML_API_BASE_URL = process.env.ML_API_URL || 'http://localhost:5000';

const getMovieRecommendations = async (userId, userBookingHistory) => {
  try {
    const response = await axios.post(`${ML_API_BASE_URL}/recommend`, {
      user_id: userId,
      user_history: userBookingHistory,
    });
    return response.data;
  } catch (error) {
    console.error('Error calling recommendation API:', error.message);
    return null;
  }
};

const predictDemand = async (movieId, showDate, showTime) => {
  try {
    const response = await axios.post(`${ML_API_BASE_URL}/predict-demand`, {
      movie_id: movieId,
      show_date: showDate,
      show_time: showTime,
    });
    return response.data;
  } catch (error) {
    console.error('Error calling demand prediction API:', error.message);
    return null;
  }
};

const getDynamicPrice = async (demand, basePrice) => {
  try {
    const response = await axios.post(`${ML_API_BASE_URL}/dynamic-price`, {
      demand,
      base_price: basePrice,
    });
    return response.data;
  } catch (error) {
    console.error('Error calling dynamic pricing API:', error.message);
    return basePrice;
  }
};

module.exports = {
  getMovieRecommendations,
  predictDemand,
  getDynamicPrice,
};
