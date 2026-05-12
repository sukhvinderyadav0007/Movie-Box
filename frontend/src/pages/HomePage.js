import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';


const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [movies, setMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    loadMovies();
    if (isAuthenticated) {
      loadRecommendations();
    }
  }, [isAuthenticated]);

  // Load movies when genre changes
  useEffect(() => {
    loadMovies();
  }, [selectedGenre]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const res = await movieAPI.getAllMovies({
        status: 'now-showing',
        ...(selectedGenre && { genre: selectedGenre }),
      });
      setMovies(res.data.movies);
    } catch (error) {
      console.error('Failed to load movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      const res = await bookingAPI.getRecommendations();
      setRecommendations(res.data.recommendations || []);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        setLoading(true);
        setSelectedGenre(''); // Clear genre filter when searching
        const res = await movieAPI.searchMovies(searchQuery);
        setMovies(res.data.movies);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // If search is cleared, reload all movies
      setSelectedGenre('');
      loadMovies();
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/booking/${movieId}`);
  };

  const genres = [
    'Action',
    'Comedy',
    'Drama',
    'Horror',
    'Romance',
    'Thriller',
    'Sci-Fi',
  ];

  if (loading && movies.length === 0) {
    return <Loading message="Loading movies..." />;
  }

  return (
    <div className="bg-dark min-h-screen">
      {/* Hero Section */}
      <div
        className="bg-gradient-to-r from-primary to-red-900 py-16"
        style={{
          backgroundImage:
            'linear-gradient(135deg, #e50914 0%, #831010 100%)',
        }}
      >
        <div className="container">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-4">
              Book Your Movie Tickets
            </h1>
            <p className="text-xl text-gray-100 mb-8">
              Experience cinema like never before. Browse, select, and book
              tickets instantly!
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
               
                <input
                  type="text"
                  placeholder="Search movies..."
                  className="input pl-12 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-secondary">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Genre Filter */}
      <div className="container py-8">
        <div className="flex gap-2 overflow-x-auto pb-4">
          <button
            onClick={() => {
              setSelectedGenre('');
              loadMovies();
            }}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
              !selectedGenre
                ? 'bg-primary text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All Genres
          </button>
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => {
                setSelectedGenre(genre);
                setSearchQuery(''); // Clear search when filtering by genre
              }}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                selectedGenre === genre
                  ? 'bg-primary text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Now Showing */}
      <div className="container py-8">
        <h2 className="text-4xl font-bold mb-8">Now Showing</h2>
        {movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
                onClick={() => handleMovieClick(movie._id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">No movies found</p>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {isAuthenticated && recommendations.length > 0 && (
        <div className="container py-8">
          <h2 className="text-4xl font-bold mb-8">Recommended For You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
                onClick={() => handleMovieClick(movie._id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
