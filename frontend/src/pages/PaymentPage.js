import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import Alert from '../components/Alert';
import { FaCreditCard, FaCheckCircle } from 'react-icons/fa';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      const res = await bookingAPI.getBookingById(bookingId);
      setBooking(res.data.booking);
    } catch (err) {
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    } else if (name === 'expiryDate') {
      if (value.length === 2 && !value.includes('/')) {
        formattedValue = value + '/';
      }
    }

    setCardData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const validateCardData = () => {
    if (!cardData.cardNumber || cardData.cardNumber.length < 19) {
      setError('Invalid card number');
      return false;
    }
    if (!cardData.expiryDate || !cardData.expiryDate.includes('/')) {
      setError('Invalid expiry date');
      return false;
    }
    if (!cardData.cvv || cardData.cvv.length < 3) {
      setError('Invalid CVV');
      return false;
    }
    if (!cardData.cardholderName) {
      setError('Cardholder name is required');
      return false;
    }
    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateCardData()) {
      return;
    }

    try {
      setProcessing(true);
      // Mock payment - always succeeds
      await bookingAPI.confirmBooking(bookingId);
      setSuccess(true);
      setTimeout(() => {
        navigate('/bookings');
      }, 3000);
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container py-8">
        <div className="card p-6">
          <p className="text-red-400">Booking not found</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container py-8">
        <div className="max-w-md mx-auto card p-8 text-center">
          <FaCheckCircle size={64} className="text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-gray-400 mb-6">
            Your booking has been confirmed. You will be redirected shortly.
          </p>
          <p className="text-primary font-semibold">
            Ref: {booking.bookingReference}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className="card p-8">
          <h1 className="text-3xl font-bold mb-6">Payment Details</h1>

          {error && (
            <Alert type="error" message={error} onClose={() => setError(null)} />
          )}

          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                name="cardholderName"
                className="input"
                placeholder="John Doe"
                value={cardData.cardholderName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Card Number
              </label>
              <div className="relative">
                <FaCreditCard className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  name="cardNumber"
                  className="input pl-10"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.cardNumber}
                  onChange={handleInputChange}
                  maxLength="19"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  className="input"
                  placeholder="MM/YY"
                  value={cardData.expiryDate}
                  onChange={handleInputChange}
                  maxLength="5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  className="input"
                  placeholder="123"
                  value={cardData.cvv}
                  onChange={handleInputChange}
                  maxLength="4"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="btn btn-primary w-full mt-6"
            >
              {processing ? 'Processing...' : 'Pay Now'}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-4 text-center">
            This is a demo payment system. Use any card details to proceed.
          </p>
        </div>

        {/* Order Summary */}
        <div className="card sticky top-24 p-8">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6 pb-6 border-b border-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-400">{booking.movieTitle}</span>
              <span className="font-semibold">₹{booking.totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Seats: {booking.seats.join(', ')}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>
                {new Date(booking.showTime).toLocaleDateString()} at{' '}
                {new Date(booking.showTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal</span>
              <span>₹{booking.totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Taxes & Fees</span>
              <span>₹0</span>
            </div>
            <div className="pt-3 border-t border-gray-700 flex justify-between text-lg font-bold">
              <span>Total Amount</span>
              <span className="text-primary">₹{booking.totalPrice}</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-400">Booking Reference</p>
            <p className="text-lg font-bold text-primary">
              {booking.bookingReference}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
