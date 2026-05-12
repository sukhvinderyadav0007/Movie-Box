import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import { FaTicketAlt, FaCalendar, FaClock, FaMapMarkerAlt, FaQrcode } from 'react-icons/fa';
import QRCode from 'qrcode.react';

const BookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingAPI.getUserBookings();
      setBookings(res.data.bookings);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingAPI.cancelBooking(bookingId);
        loadBookings();
        setError(null);
      } catch (err) {
        setError('Failed to cancel booking');
      }
    }
  };

  if (loading) return <Loading message="Loading bookings..." />;

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">My Bookings</h1>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="card p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Booking Details */}
                <div className="lg:col-span-2">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {booking.movieTitle}
                      </h2>
                      <p className="text-gray-400 text-sm">
                        Booking Reference: {booking.bookingReference}
                      </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      booking.status === 'confirmed'
                        ? 'bg-green-900/30 text-green-200'
                        : booking.status === 'cancelled'
                        ? 'bg-red-900/30 text-red-200'
                        : 'bg-yellow-900/30 text-yellow-200'
                    }`}>
                      {booking.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <FaCalendar className="text-primary" />
                      {new Date(booking.showTime).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <FaClock className="text-primary" />
                      {new Date(booking.showTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <FaMapMarkerAlt className="text-primary" />
                      Screen {booking.screenNumber}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <FaTicketAlt className="text-primary" />
                      {booking.seats.join(', ')}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-400 text-sm">Total Price</p>
                        <p className="text-3xl font-bold text-primary">
                          ₹{booking.totalPrice}
                        </p>
                      </div>
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() =>
                            handleCancelBooking(booking._id)
                          }
                          className="btn btn-outline"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                {booking.status === 'confirmed' && booking.qrCode && (
                  <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg">
                    <FaQrcode size={24} className="text-primary mb-4" />
                    <p className="text-sm text-gray-400 text-center mb-4">
                      Scan to verify
                    </p>
                    <QRCode
                      value={booking.qrCode}
                      size={200}
                      bgColor="#1f2937"
                      fgColor="#f5f5f1"
                    />
                    <p className="text-xs text-gray-400 mt-4 text-center">
                      Show this QR code at the theatre
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <FaTicketAlt size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg mb-6">No bookings yet</p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Browse Movies
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
