import React from 'react';
import { FaHome, FaFilm, FaTicketAlt, FaUser, FaSignOutAlt, FaVideo } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold gradient-text">
          <FaVideo size={28} />
          MovieBox
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="flex items-center gap-2 hover:text-primary transition">
            <FaHome size={18} />
            <span className="hidden sm:inline">Home</span>
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/bookings"
                className="flex items-center gap-2 hover:text-primary transition"
              >
                <FaTicketAlt size={18} />
                <span className="hidden sm:inline">My Bookings</span>
              </Link>

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 hover:text-primary transition"
                >
                  <FaFilm size={18} />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}

              <Link
                to="/profile"
                className="flex items-center gap-2 hover:text-primary transition"
              >
                <FaUser size={18} />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-primary flex items-center gap-2"
              >
                <FaSignOutAlt size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}

          {!isAuthenticated && (
            <>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
