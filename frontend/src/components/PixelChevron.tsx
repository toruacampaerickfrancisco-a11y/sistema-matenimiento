import React from 'react';

const PixelChevron: React.FC<{ size?: number }> = ({ size = 80 }) => {
  // Colors based on the image description
  // Top is purple/maroon
  // Right side descends in purple
  // Left side descends in orange/gold
  
  const purpleDark = "#580c35";
  const purpleMedium = "#7e1542";
  const purpleLight = "#9e1f4b";
  
  const orangeDark = "#c9563c";
  const orangeMedium = "#e38d42";
  const orangeLight = "#f2b34d";

  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 110 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Top Peak */}
      <rect x="50" y="0" width="10" height="10" fill={purpleDark} />
      
      {/* Right Side (Purple Gradient) */}
      <rect x="60" y="10" width="10" height="10" fill={purpleDark} />
      <rect x="70" y="20" width="10" height="10" fill={purpleMedium} />
      <rect x="80" y="30" width="10" height="10" fill={purpleMedium} />
      <rect x="90" y="40" width="10" height="10" fill={purpleLight} />
      <rect x="100" y="50" width="10" height="10" fill={purpleLight} />

      {/* Left Side (Orange Gradient) */}
      <rect x="40" y="10" width="10" height="10" fill={orangeDark} />
      <rect x="30" y="20" width="10" height="10" fill={orangeDark} />
      <rect x="20" y="30" width="10" height="10" fill={orangeMedium} />
      <rect x="10" y="40" width="10" height="10" fill={orangeMedium} />
      <rect x="0" y="50" width="10" height="10" fill={orangeLight} />
    </svg>
  );
};

export default PixelChevron;