import React from 'react';

interface RealtimeIndicatorProps {
  isConnected: boolean;
  className?: string;
}

export default function RealtimeIndicator({ isConnected, className = '' }: RealtimeIndicatorProps) {
  return (
    <div 
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '16px',
        height: '16px',
        opacity: 0.5,
        transition: 'opacity 0.3s ease',
      }}
      title={isConnected ? 'Sistema sincronizado automáticamente' : 'Sistema sin sincronización automática'}
    >
      <div
        style={{
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          backgroundColor: isConnected ? '#22c55e' : '#d1d5db',
          transition: 'all 0.3s ease',
        }}
      />
      

    </div>
  );
}