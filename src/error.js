import React, { useState, useEffect } from 'react';

const ErrorPopup = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 3000); // Change this to control the duration

    return () => clearTimeout(timer); // This will clear the timer when the component unmounts
  }, [onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-start justify-center h-screen bg-gray-500 opacity-75 transition-opacity duration-1000">
      <div className="bg-white rounded-lg shadow-md p-4 mt-4">
        <h5 className="text-lg font-medium text-center text-red-500">Error</h5>
        <p className="text-black text-center mb-4">{message}</p>
      </div>
    </div>
  );
};

export default ErrorPopup;