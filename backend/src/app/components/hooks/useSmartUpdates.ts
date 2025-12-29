'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
// import { useSmartPause } from './useIdleDetector';
// import { useNetworkStatus } from './useNetworkStatus';

// Función para logging (opcional, solo en desarrollo)
const logUpdate = (endpoint: string, status: 'success' | 'cached' | 'paused' | 'offline', interval: number) => {
  if (typeof window !== 'undefined' && (window as any).addUpdateLog) {
    (window as any).addUpdateLog({ endpoint, status, interval });
  }
};

interface SmartUpdateOptions {
  endpoint: string;
  interval?: number;
  onUpdate?: (data: any) => void;
  enabled?: boolean;
  dependencies?: string[];
}

export function useSmartUpdates({
  endpoint,
  interval = 120000, // 2 minutos por defecto - mucho más espaciado
  onUpdate,
  enabled = true,
  dependencies = []
}: SmartUpdateOptions) {
  const [data, setData] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastHashRef = useRef<string>('');
  const pausedRef = useRef<boolean>(false);
  const unchangedCountRef = useRef<number>(0); // Contador de actualizaciones sin cambios
  const adaptiveIntervalRef = useRef<number>(interval);
  // const shouldPauseForInactivity = useSmartPause(); // Detector de inactividad
  // const isOnline = useNetworkStatus(); // Detector de conexión

  // Función para generar hash de los datos
  const generateHash = useCallback((obj: any): string => {
    try {
      return btoa(JSON.stringify(obj)).slice(0, 32);
    } catch {
      return Date.now().toString();
    }
  }, []);

  // Función de actualización silenciosa con intervalo adaptativo
  const silentUpdate = useCallback(async () => {
    if (!enabled || pausedRef.current) {
      return;
    }
    
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (response.ok) {
        const newData = await response.json();
        const newHash = generateHash(newData);
        
        // Solo actualizar si realmente hay cambios
        if (newHash !== lastHashRef.current) {
          setData(newData);
          setLastUpdate(Date.now());
          lastHashRef.current = newHash;
          unchangedCountRef.current = 0; // Reset contador
          adaptiveIntervalRef.current = interval; // Reset intervalo
          
          if (onUpdate) {
            onUpdate(newData);
          }
          
          // COMPLETAMENTE SILENCIOSO - Sin logs en desarrollo
          // Solo log crítico si hay cambios reales
          // console.debug(`🔄 Smart update con cambios: ${endpoint.split('?')[0]}`);
        } else {
          // Si no hay cambios, incrementar contador y hacer intervalos más espaciados
          unchangedCountRef.current++;
          
          // Intervalo adaptativo: si no hay cambios por mucho tiempo, reducir frecuencia
          if (unchangedCountRef.current > 3) {
            adaptiveIntervalRef.current = Math.min(interval * 3, 300000); // Max 5 minutos
            
            // COMPLETAMENTE SILENCIOSO - Sin logs de intervalos
            // console.debug(`🐌 Intervalos más espaciados para ${endpoint.split('?')[0]}: ${adaptiveIntervalRef.current/1000}s`);
          }
        }
      }
    } catch (error) {
      // COMPLETAMENTE SILENCIOSO - Sin logs de errores
      // console.debug('❌ Smart update error:', error);
    }
  }, [endpoint, enabled, onUpdate, generateHash, interval]);

  // Función para pausar temporalmente las actualizaciones
  const pauseUpdates = useCallback((duration: number = 10000) => {
    pausedRef.current = true;
    setTimeout(() => {
      pausedRef.current = false;
    }, duration);
  }, []);

  // Función para forzar actualización inmediata
  const forceUpdate = useCallback(() => {
    silentUpdate();
  }, [silentUpdate]);

  useEffect(() => {
    if (!enabled) return;

    // Primera carga
    silentUpdate();

    // Función para configurar intervalo adaptativo
    const setupAdaptiveInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        silentUpdate();
        // Reconfigurar con nuevo intervalo adaptativo si cambió
        if (adaptiveIntervalRef.current !== interval) {
          setupAdaptiveInterval();
        }
      }, adaptiveIntervalRef.current);
    };

    setupAdaptiveInterval();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, silentUpdate, ...dependencies]);

  return {
    data,
    lastUpdate,
    forceUpdate,
    pauseUpdates
  };
}