import React, { useState } from 'react';
import { FaChair } from 'react-icons/fa';

const SeatSelector = ({ totalSeats = 100, bookedSeats = [], onSeatsSelect }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const seatsPerRow = 10;
  const rows = Math.ceil(totalSeats / seatsPerRow);

  const seatRows = Array.from({ length: rows }, (_, i) => {
    const start = i * seatsPerRow;
    const end = Math.min(start + seatsPerRow, totalSeats);
    return Array.from({ length: end - start }, (_, j) => {
      const seatNumber = `${String.fromCharCode(65 + i)}${j + 1}`;
      return seatNumber;
    });
  });

  const handleSeatClick = (seat) => {
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats((prev) => {
      const updated = prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat];
      onSeatsSelect(updated);
      return updated;
    });
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <h3 className="text-2xl font-bold mb-6 text-center">Select Seats</h3>

      {/* Screen */}
      <div className="text-center mb-8">
        <div className="inline-block border-4 border-primary px-8 py-2 rounded-full">
          <p className="text-white font-semibold">SCREEN</p>
        </div>
      </div>

      {/* Seats Grid */}
      <div className="grid gap-3 justify-center">
        {seatRows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-2 justify-center items-center">
            <span className="w-8 text-right text-gray-400 text-sm font-semibold">
              {String.fromCharCode(65 + rowIdx)}
            </span>
            <div className="flex gap-2">
              {row.map((seat) => {
                const isBooked = bookedSeats.includes(seat);
                const isSelected = selectedSeats.includes(seat);

                return (
                  <button
                    key={seat}
                    onClick={() => handleSeatClick(seat)}
                    disabled={isBooked}
                    className={`
                      p-2 rounded transition-all duration-200 flex items-center justify-center
                      ${
                        isBooked
                          ? 'bg-gray-700 cursor-not-allowed opacity-50'
                          : isSelected
                          ? 'bg-primary text-white scale-110'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }
                    `}
                    title={seat}
                  >
                    <FaChair size={14} />
                  </button>
                );
              })}
            </div>
            <span className="w-8 text-gray-400 text-sm font-semibold">
              {String.fromCharCode(65 + rowIdx)}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-8 justify-center mt-8 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-700 rounded"></div>
          <span className="text-gray-300">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded"></div>
          <span className="text-gray-300">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-700 rounded opacity-50"></div>
          <span className="text-gray-300">Booked</span>
        </div>
      </div>

      {/* Selected Info */}
      {selectedSeats.length > 0 && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg text-center">
          <p className="text-white">
            <span className="font-bold text-primary text-lg">{selectedSeats.length}</span> seat(s) selected
          </p>
          <p className="text-gray-400 text-sm">
            {selectedSeats.sort().join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default SeatSelector;
