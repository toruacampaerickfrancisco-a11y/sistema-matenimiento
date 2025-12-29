import React from 'react';
import PixelChevron from './PixelChevron';

interface StatTriangleProps {
  value: number | string;
  label: string;
  subLabel?: string;
}

const StatTriangle: React.FC<StatTriangleProps> = ({ value, label, subLabel }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0.5rem' }}>
      <div style={{ marginBottom: '0.25rem' }}>
        <PixelChevron size={60} />
      </div>
      <div style={{ 
        fontSize: '3rem', 
        fontWeight: 900, 
        lineHeight: 1, 
        color: '#3f0e28', // Dark purple/black
        fontFamily: 'Arial, sans-serif',
        marginBottom: '0.25rem'
      }}>
        {value}
      </div>
      <div style={{ 
        fontSize: '0.9rem', 
        fontWeight: 700, 
        color: '#831843', // Magenta/Purple
        textTransform: 'none',
        maxWidth: '200px',
        lineHeight: 1.2
      }}>
        {label}
      </div>
      {subLabel && (
        <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>{subLabel}</div>
      )}
    </div>
  );
};

export default StatTriangle;