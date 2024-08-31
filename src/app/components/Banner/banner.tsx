import React from 'react';
import './banner.css'; // Ensure you have the CSS file with custom styles

const Banner: React.FC = () => {
  return (
    <div className="relative h-[500px] bg-liquid-black text-liquid-po overflow-hidden w-[100vw]">
      {/* Wavy Water Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Single div for the water body with animated waves */}
        <div className="water"></div>
      </div>
      {/* Title */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1
          className="text-liquid-banner-header font-liquid-bold text-liquid-blue"
          style={{ transform: 'translateY(-20%)' }}
        >
          Liquid.
        </h1>
      </div>
    </div>
  );
};

export default Banner;
