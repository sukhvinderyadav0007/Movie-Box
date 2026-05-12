const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const generateQRCode = (bookingId, movieTitle, showTime, seats) => {
  const qrData = JSON.stringify({
    bookingId,
    movieTitle,
    showTime,
    seats,
    timestamp: new Date(),
  });
  return Buffer.from(qrData).toString('base64');
};

const calculateDynamicPrice = (demand, basePrice) => {
  if (demand > 80) {
    return Math.ceil(basePrice * 1.3); // 30% increase
  } else if (demand > 60) {
    return Math.ceil(basePrice * 1.15); // 15% increase
  } else if (demand < 30) {
    return Math.ceil(basePrice * 0.8); // 20% decrease
  }
  return basePrice;
};

const generateBookingReference = () => {
  return 'BK' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
};

module.exports = {
  generateToken,
  generateQRCode,
  calculateDynamicPrice,
  generateBookingReference,
};
