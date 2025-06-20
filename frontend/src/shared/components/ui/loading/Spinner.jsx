// src/shared/components/Spinner.jsx
import React from 'react';

const Spinner = ({ size = '24px', color = '#ffffff', className = '' }) => {
  return (
    <div 
      className={`animate-spin rounded-full border-b-2 border-gray-900 ${className}`} 
      style={{ 
        width: size, 
        height: size, 
        borderColor: color, 
        borderTopColor: 'transparent',
      }}
    ></div>
  );
};

export default Spinner;