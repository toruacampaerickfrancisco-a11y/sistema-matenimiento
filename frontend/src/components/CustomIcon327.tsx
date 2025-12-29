import React from 'react';
import iconImage from '@/assets/327-icon-clean.png';

interface CustomIcon327Props {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const CustomIcon327: React.FC<CustomIcon327Props> = ({ 
  size = 24, 
  className = '', 
  style = {} 
}) => {
  return (
    <img 
      src={iconImage}
      alt="327 Icon"
      width={size}
      height={size}
      className={className}
      style={{
        objectFit: 'contain',
        background: 'transparent',
        ...style
      }}
    />
  );
};

export default CustomIcon327;