import React from 'react';

const Button = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-4 rounded hover:from-blue-600 hover:to-purple-600 transition-all duration-500 shadow-lg"
    >
      {children}
    </button>
  );
};

export default Button;