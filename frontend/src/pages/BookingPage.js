import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { movieAPI, showAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SeatSelector from '../components/SeatSelector';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import { FaArrowLeft, FaClock, FaCalendar, FaUsers } from 'react-icons/fa';

const BookingPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadMovieAndShows();
  }, [movieId, isAuthenticated]);

  const loadMovieAndShows = async () => {
    try {
      setLoading(true);
      const movieRes = await movieAPI.getMovieById(movieId);
      setMovie(movieRes.data.movie);

      const showsRes = await showAPI.getShowsByMovie(movieId);
      setShows(showsRes.data.shows);
    } catch (err) {
      setError('Failed to load movie details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedShow || selectedSeats.length === 0) {
      setError('Please select a show and seats');
      return;
    }

    try {
      setLoading(true);
      const response = await bookingAPI.createBooking({
        showId: selectedShow._id,
        seats: selectedSeats,
        numberOfTickets: selectedSeats.length,
        pricePerTicket: selectedShow.dynamicPrice,
      });

      setSuccess('Booking created! Proceeding to payment...');
      setTimeout(() => {
        navigate(`/payment/${response.data.booking._id}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading movie details..." />;

  if (!movie) return <div className="container py-8">Movie not found</div>;

  const bookedSeats = selectedShow
    ? selectedShow.bookedSeats.map((b) => b.seatNumber)
    : [];

  const totalPrice = selectedSeats.length * (selectedShow?.dynamicPrice || 0);

  return (
    <div className="container py-8">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary hover:text-red-400 mb-6"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Movie Details */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-96 object-cover"
            />
            <div className="p-6">
              <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
              <p className="text-gray-300 mb-4">{movie.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-400">Duration</p>
                  <p className="text-xl font-semibold">{movie.duration} min</p>
                </div>
                <div>
                  <p className="text-gray-400">Language</p>
                  <p className="text-xl font-semibold">{movie.language}</p>
                </div>
                <div>
                  <p className="text-gray-400">Genre</p>
                  <p className="text-xl font-semibold">{movie.genre?.join(', ')}</p>
                </div>
                <div>
                  <p className="text-gray-400">Rating</p>
                  <p className="text-xl font-semibold text-primary">{movie.rating}/10</p>
                </div>
              </div>
            </div>
          </div>

          {/* Show Selection */}
          <div className="card p-6 mt-6">
            <h2 className="text-2xl font-bold mb-4">Select Show</h2>
            {shows.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {shows.map((show) => (
                  <button
                    key={show._id}
                    onClick={() => {
                      setSelectedShow(show);
                      setSelectedSeats([]);
                    }}
                    className={`p-4 rounded-lg border-2 text-left transition ${
                      selectedShow?._id === show._id
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-700 hover:border-primary'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-semibold flex items-center gap-2">
                            <FaClock size={16} />
                            {new Date(show.startTime).toLocaleTimeString()}
                          </p>
                          <p className="text-sm text-gray-400">
                            Screen {show.screen}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          ₹{show.dynamicPrice}
                        </p>
                        <p className="text-sm text-gray-400">
                          {show.availableSeats} seats available
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No shows available</p>
            )}
          </div>

          {/* Seat Selection */}
          {selectedShow && (
            <div className="card p-6 mt-6">
              <SeatSelector
                totalSeats={selectedShow.totalSeats}
                bookedSeats={bookedSeats}
                onSeatsSelect={setSelectedSeats}
              />
            </div>
          )}
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24 p-6">
            <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>

            {selectedShow && (
              <div className="space-y-4 mb-6">
                <div className="pb-4 border-b border-gray-700">
                  <p className="text-gray-400 text-sm">Movie</p>
                  <p className="font-semibold">{movie.title}</p>
                </div>

                <div className="pb-4 border-b border-gray-700">
                  <p className="text-gray-400 text-sm">Show Time</p>
                  <p className="font-semibold flex items-center gap-2">
                    <FaClock size={14} />
                    {new Date(selectedShow.startTime).toLocaleString()}
                  </p>
                </div>

                <div className="pb-4 border-b border-gray-700">
                  <p className="text-gray-400 text-sm">Screen</p>
                  <p className="font-semibold">{selectedShow.screen}</p>
                </div>

                <div className="pb-4 border-b border-gray-700">
                  <p className="text-gray-400 text-sm">Seats</p>
                  <p className="font-semibold">
                    {selectedSeats.length > 0
                      ? selectedSeats.sort().join(', ')
                      : 'No seats selected'}
                  </p>
                </div>

                <div className="pb-4 border-b border-gray-700">
                  <p className="text-gray-400 text-sm">Price per Ticket</p>
                  <p className="font-semibold text-primary">
                    ₹{selectedShow.dynamicPrice}
                  </p>
                </div>

                <div className="pb-4 border-b border-gray-700">
                  <p className="text-gray-400 text-sm">Number of Tickets</p>
                  <p className="font-semibold flex items-center gap-2">
                    <FaUsers size={14} />
                    {selectedSeats.length}
                  </p>
                </div>

                <div className="pt-4 bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Total Price</p>
                  <p className="text-3xl font-bold text-primary">₹{totalPrice}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleBooking}
              disabled={!selectedShow || selectedSeats.length === 0 || loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
