'use client';

import React, { useEffect, useState } from 'react';
import { useSmartPause } from './hooks/useIdleDetector';
import { useNetworkStatus } from './hooks/useNetworkStatus';

interface UpdateLog {
  timestamp: string;
  endpoint: string;
  status: 'success' | 'cached' | 'paused' | 'offline';
  interval: number;
}

// Estado global para logs
const updateLogs: UpdateLog[] = [];
const logListeners: ((logs: UpdateLog[]) => void)[] = [];

export const addUpdateLog = (log: Omit<UpdateLog, 'timestamp'>) => {
  const newLog = {
    ...log,
    timestamp: new Date().toLocaleTimeString()
  };
  
  updateLogs.push(newLog);
  if (updateLogs.length > 20) {
    updateLogs.shift(); // Mantener solo los últimos 20
  }
  
  logListeners.forEach(listener => listener([...updateLogs]));
};

// Exponer globalmente para debugging
if (typeof window !== 'undefined') {
  (window as any).addUpdateLog = addUpdateLog;
}

export default function SystemDebugPanel() {
  const [logs, setLogs] = useState<UpdateLog[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const shouldPause = useSmartPause();
  const isOnline = useNetworkStatus();

  useEffect(() => {
    const listener = (newLogs: UpdateLog[]) => setLogs(newLogs);
    logListeners.push(listener);
    
    return () => {
      const index = logListeners.indexOf(listener);
      if (index > -1) logListeners.splice(index, 1);
    };
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#7b1343',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          fontSize: '16px',
          zIndex: 9999
        }}
        title="Ver estado del sistema"
      >
        🐛
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'white',
      border: '2px solid #7b1343',
      borderRadius: '10px',
      padding: '15px',
      maxWidth: '400px',
      maxHeight: '300px',
      overflowY: 'auto',
      fontSize: '12px',
      zIndex: 9999,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <h4 style={{ margin: 0, color: '#7b1343' }}>Estado del Sistema</h4>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          ❌
        </button>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <div style={{
          padding: '5px',
          borderRadius: '5px',
          backgroundColor: shouldPause ? '#fff3cd' : '#d1edff'
        }}>
          🛌 Usuario: {shouldPause ? 'Inactivo' : 'Activo'}
        </div>
        <div style={{
          padding: '5px',
          borderRadius: '5px',
          backgroundColor: isOnline ? '#d1edff' : '#f8d7da',
          marginTop: '5px'
        }}>
          🌐 Red: {isOnline ? 'Conectado' : 'Desconectado'}
        </div>
      </div>

      <div style={{ fontSize: '11px' }}>
        <strong>Últimas Actualizaciones:</strong>
        {logs.length === 0 ? (
          <div style={{ color: '#666', fontStyle: 'italic' }}>
            Sin actualizaciones aún...
          </div>
        ) : (
          logs.slice(-10).reverse().map((log, i) => (
            <div key={i} style={{
              padding: '3px',
              borderLeft: `3px solid ${
                log.status === 'success' ? '#28a745' :
                log.status === 'cached' ? '#17a2b8' :
                log.status === 'paused' ? '#ffc107' : '#dc3545'
              }`,
              marginTop: '3px',
              paddingLeft: '8px',
              backgroundColor: '#f8f9fa'
            }}>
              <div>
                <strong>{log.timestamp}</strong> - {log.endpoint.split('/').pop()}
              </div>
              <div style={{ color: '#666' }}>
                {log.status === 'success' ? '✅ Actualizado' :
                 log.status === 'cached' ? '💾 Cache' :
                 log.status === 'paused' ? '⏸️ Pausado' : '📵 Sin red'}
                 {log.status === 'success' && ` (${log.interval/1000}s)`}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}