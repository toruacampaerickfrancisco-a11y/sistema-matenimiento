'use client';

import { useEffect, useRef, useState } from 'react';

interface IdleDetectorOptions {
  timeout?: number; // Tiempo en ms para considerar inactividad
  events?: string[]; // Eventos que resetean el timer de inactividad
}

export function useIdleDetector({
  timeout = 300000, // 5 minutos por defecto
  events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
}: IdleDetectorOptions = {}) {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setIsIdle(false);
    
    timeoutRef.current = setTimeout(() => {
      setIsIdle(true);
      console.debug('🛌 Usuario inactivo - ralentizando actualizaciones');
    }, timeout);
  };

  useEffect(() => {
    // Configurar listeners para actividad del usuario
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    // Timer inicial
    resetTimer();

    return () => {
      // Limpiar listeners
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [timeout]);

  return isIdle;
}

// Hook para pausar automáticamente las actualizaciones durante inactividad
export function useSmartPause() {
  const isIdle = useIdleDetector();
  const [shouldPause, setShouldPause] = useState(false);

  useEffect(() => {
    if (isIdle) {
      setShouldPause(true);
      console.debug('⏸️ Pausando actualizaciones por inactividad');
    } else {
      setShouldPause(false);
      console.debug('▶️ Reanudando actualizaciones - usuario activo');
    }
  }, [isIdle]);

  return shouldPause;
}