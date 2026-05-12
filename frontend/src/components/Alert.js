import React from 'react';
import { FaCheckCircle, FaSpinner, FaExclamationCircle } from 'react-icons/fa';

const Alert = ({ type = 'info', message, onClose }) => {
  const getStyles = () => {
    const baseClass =
      'p-4 rounded-lg flex items-center gap-3 mb-4 animate-fadeIn';
    switch (type) {
      case 'success':
        return `${baseClass} bg-green-900/30 border-l-4 border-green-500 text-green-200`;
      case 'error':
        return `${baseClass} bg-red-900/30 border-l-4 border-red-500 text-red-200`;
      case 'warning':
        return `${baseClass} bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-200`;
      default:
        return `${baseClass} bg-blue-900/30 border-l-4 border-blue-500 text-blue-200`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle size={20} />;
      case 'error':
        return <FaExclamationCircle size={20} />;
      case 'warning':
        return <FaExclamationCircle size={20} />;
      default:
        return <FaSpinner size={20} className="animate-spin" />;
    }
  };

  return (
    <div className={getStyles()}>
      {getIcon()}
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-lg">
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
