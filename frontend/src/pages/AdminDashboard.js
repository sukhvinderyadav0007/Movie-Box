import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import { FaUsers, FaFilm, FaTicketAlt, FaChartBar } from 'react-icons/fa';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [bookingAnalytics, setBookingAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [analRes, bookRes] = await Promise.all([
        adminAPI.getAnalytics(),
        adminAPI.getBookingAnalytics(),
      ]);
      setAnalytics(analRes.data.analytics);
      setBookingAnalytics(bookRes.data.analytics);
    } catch (err) {
      setError('Failed to load analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading analytics..." />;

  if (!analytics) {
    return (
      <div className="container py-8">
        <Alert type="error" message={error} onClose={() => setError(null)} />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-4xl font-bold mt-2">{analytics.totalUsers}</p>
            </div>
            <FaUsers size={40} className="text-primary opacity-30" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Movies</p>
              <p className="text-4xl font-bold mt-2">{analytics.totalMovies}</p>
            </div>
            <FaFilm size={40} className="text-primary opacity-30" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Bookings</p>
              <p className="text-4xl font-bold mt-2">
                {analytics.totalBookings}
              </p>
            </div>
            <FaTicketAlt size={40} className="text-primary opacity-30" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-4xl font-bold mt-2 text-primary">
                ₹{analytics.totalRevenue}
              </p>
            </div>
            <FaChartBar size={40} className="text-primary opacity-30" />
          </div>
        </div>
      </div>

      {/* Top Movies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-4">Top Movies</h2>
          <div className="space-y-3">
            {analytics.topMovies?.map((movie, idx) => (
              <div key={movie._id} className="flex justify-between items-center p-3 bg-gray-800 rounded">
                <div>
                  <p className="font-semibold">{idx + 1}. {movie.title}</p>
                  <p className="text-sm text-gray-400">
                    {movie.totalBookings} bookings
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{movie.popularity}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Status */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-4">Booking Status</h2>
          <div className="space-y-3">
            {bookingAnalytics?.bookingsByStatus?.map((item) => (
              <div key={item._id} className="flex justify-between items-center p-3 bg-gray-800 rounded">
                <span className="capitalize font-semibold">{item._id}</span>
                <span className="text-primary text-lg">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-3">Booking Ref</th>
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Movie</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentBookings?.map((booking) => (
                <tr key={booking._id} className="border-b border-gray-800">
                  <td className="p-3 font-mono text-sm">
                    {booking.bookingReference}
                  </td>
                  <td className="p-3">{booking.userId?.name}</td>
                  <td className="p-3">{booking.movieId?.title}</td>
                  <td className="p-3 text-primary font-bold">
                    ₹{booking.totalPrice}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        booking.status === 'confirmed'
                          ? 'bg-green-900/30 text-green-200'
                          : 'bg-yellow-900/30 text-yellow-200'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
