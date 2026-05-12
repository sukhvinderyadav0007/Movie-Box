import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="loading">
      <div className="text-center">
        <div className="inline-block">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-primary rounded-full animate-spin mb-4"></div>
        </div>
        <p className="text-gray-300 text-lg">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
