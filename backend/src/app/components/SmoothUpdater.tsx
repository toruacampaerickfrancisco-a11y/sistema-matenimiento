import React, { useState, useEffect } from 'react';

interface SmoothUpdaterProps {
  isUpdating: boolean;
  children: React.ReactNode;
  updateInterval?: number;
}

export default function SmoothUpdater({ isUpdating, children, updateInterval = 15000 }: SmoothUpdaterProps) {
  const [opacity, setOpacity] = useState(1);
  const [showUpdateIndicator, setShowUpdateIndicator] = useState(false);

  useEffect(() => {
    if (isUpdating) {
      // Mostrar indicador muy sutil solo por 500ms
      setShowUpdateIndicator(true);
      setTimeout(() => setShowUpdateIndicator(false), 500);
    }
  }, [isUpdating]);

  return (
    <div 
      style={{ 
        position: 'relative',
        transition: 'opacity 0.3s ease-in-out',
        opacity: opacity 
      }}
    >
      {children}
      
      {/* Indicador muy discreto de actualización */}
      {showUpdateIndicator && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '8px',
            height: '8px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            opacity: 0.6,
            animation: 'smoothPulse 0.5s ease-in-out',
            zIndex: 1000,
          }}
        />
      )}
      
      <style jsx>{`
        @keyframes smoothPulse {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}