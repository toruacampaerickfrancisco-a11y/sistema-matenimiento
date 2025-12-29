import { useEffect, useRef, useCallback } from 'react';
import { useInvisibleCache } from './useInvisibleCache';

interface SilentUpdateOptions {
  endpoint: string;
  interval?: number;
  onDataUpdate?: (data: any) => void;
  enabled?: boolean;
  cacheKey?: string;
}

export function useSilentUpdate({
  endpoint,
  interval = 30000, // 30 segundos por defecto
  onDataUpdate,
  enabled = true,
  cacheKey
}: SilentUpdateOptions) {
  const { updateIfChanged, get } = useInvisibleCache(cacheKey || endpoint);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingRef = useRef(false);

  // Función para actualizar datos silenciosamente
  const silentFetch = useCallback(async () => {
    if (isUpdatingRef.current || !enabled) return;
    
    isUpdatingRef.current = true;
    
    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const newData = await response.json();
      
      // Solo actualizar si realmente hay cambios
      const hasChanges = updateIfChanged(endpoint, newData);
      
      if (hasChanges && onDataUpdate) {
        onDataUpdate(newData);
      }
      
    } catch (error) {
      // Error silencioso - no mostrar nada al usuario
      console.debug('Silent update failed:', endpoint, error);
    } finally {
      isUpdatingRef.current = false;
    }
  }, [endpoint, enabled, updateIfChanged, onDataUpdate]);

  // Configurar intervalo de actualización
  useEffect(() => {
    if (!enabled) return;

    // Primera carga inmediata
    silentFetch();

    // Configurar intervalo
    intervalRef.current = setInterval(silentFetch, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [silentFetch, interval, enabled]);

  // Función para forzar actualización manual (sin loading visual)
  const forceUpdate = useCallback(() => {
    if (!isUpdatingRef.current) {
      silentFetch();
    }
  }, [silentFetch]);

  return {
    forceUpdate,
    isEnabled: enabled,
    getCachedData: () => get(endpoint)
  };
}