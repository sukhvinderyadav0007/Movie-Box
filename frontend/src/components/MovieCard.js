import React, { useState } from 'react';
import { FaStar, FaClock, FaCalendar } from 'react-icons/fa';

const MovieCard = ({ movie, onClick }) => {
  const [imageError, setImageError] = useState(false);
  
  const fallbackImage = 'https://via.placeholder.com/300x400/1a1a1a/e50914?text=No+Image';

  return (
    <div
      className="card cursor-pointer transform hover:scale-105 transition-transform duration-300"
      onClick={onClick}
    >
      <div className="relative overflow-hidden h-96">
        <img
          src={imageError ? fallbackImage : movie.posterUrl}
          alt={movie.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-0 right-0 bg-primary px-3 py-1 m-2 rounded-full">
          <div className="flex items-center gap-1 text-white">
            <FaStar size={14} />
            <span className="text-sm font-semibold">{movie.rating}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-white truncate">
          {movie.title}
        </h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {movie.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {movie.genre?.slice(0, 2).map((g, idx) => (
            <span key={idx} className="bg-gray-800 px-2 py-1 rounded text-xs">
              {g}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center text-gray-400 text-sm">
          <div className="flex items-center gap-1">
            <FaClock size={12} />
            <span>{movie.duration} min</span>
          </div>
          <div className="flex items-center gap-1">
            <FaCalendar size={12} />
            <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
