'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useEventSubscription, useEventTrigger, UpdateEventType } from './useEventUpdates';

interface PreciseUpdateOptions {
  endpoint: string;
  eventTypes: UpdateEventType[]; // Solo actualizar en estos eventos específicos
  onUpdate?: (data: any) => void;
  enabled?: boolean;
  dependencies?: string[];
  cacheKey?: string; // Clave única para el cache
}

interface CacheEntry {
  data: any;
  hash: string;
  timestamp: number;
}

// Cache global para evitar requests innecesarios
const updateCache = new Map<string, CacheEntry>();

export function usePreciseUpdates({
  endpoint,
  eventTypes,
  onUpdate,
  enabled = true,
  dependencies = [],
  cacheKey
}: PreciseUpdateOptions) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const triggerEvent = useEventTrigger();
  const lastHashRef = useRef<string>('');
  const mountedRef = useRef(true);

  // Generar clave única para el cache
  const finalCacheKey = cacheKey || `${endpoint}-${dependencies.join('-')}`;

  // Función para generar hash de los datos
  const generateHash = useCallback((obj: any): string => {
    try {
      return btoa(JSON.stringify(obj)).slice(0, 32);
    } catch {
      return Date.now().toString();
    }
  }, []);

  // 🎯 Función de actualización precisa - solo cuando es necesario
  const updateData = useCallback(async (force = false) => {
    if (!enabled || !mountedRef.current) return;

    try {
      // Verificar cache primero
      const cached = updateCache.get(finalCacheKey);
      if (!force && cached && (Date.now() - cached.timestamp) < 30000) {
        // Cache válido por 30 segundos
        const dataHash = generateHash(cached.data);
        if (dataHash !== lastHashRef.current) {
          setData(cached.data);
          lastHashRef.current = dataHash;
          onUpdate?.(cached.data);
        }
        return cached.data;
      }

      setError(null);
      
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const newData = await response.json();
      const newHash = generateHash(newData);
      
      // Solo actualizar si los datos realmente cambiaron
      if (newHash !== lastHashRef.current) {
        setData(newData);
        lastHashRef.current = newHash;
        onUpdate?.(newData);
        
        // Actualizar cache
        updateCache.set(finalCacheKey, {
          data: newData,
          hash: newHash,
          timestamp: Date.now()
        });
        
        return newData;
      }
      
      return data;
    } catch (err) {
      console.error(`Error actualizando ${endpoint}:`, err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [enabled, endpoint, finalCacheKey, generateHash, onUpdate, data]);

  // 📡 Suscribirse a eventos específicos
  useEventSubscription('user-created', useCallback(() => {
    if (eventTypes.includes('user-created')) {
      updateData(true);
    }
  }, [eventTypes, updateData]));

  useEventSubscription('user-updated', useCallback(() => {
    if (eventTypes.includes('user-updated')) {
      updateData(true);
    }
  }, [eventTypes, updateData]));

  useEventSubscription('user-deleted', useCallback(() => {
    if (eventTypes.includes('user-deleted')) {
      updateData(true);
    }
  }, [eventTypes, updateData]));

  useEventSubscription('equipment-created', useCallback(() => {
    if (eventTypes.includes('equipment-created')) {
      updateData(true);
    }
  }, [eventTypes, updateData]));

  useEventSubscription('equipment-updated', useCallback(() => {
    if (eventTypes.includes('equipment-updated')) {
      updateData(true);
    }
  }, [eventTypes, updateData]));

  useEventSubscription('equipment-deleted', useCallback(() => {
    if (eventTypes.includes('equipment-deleted')) {
      updateData(true);
    }
  }, [eventTypes, updateData]));

  useEventSubscription('ticket-created', useCallback(() => {
    if (eventTypes.includes('ticket-created')) {
      updateData(true);
    }
  }, [eventTypes, updateData]));

  useEventSubscription('ticket-updated', useCallback(() => {
    if (eventTypes.includes('ticket-updated')) {
      updateData(true);
    }
  }, [eventTypes, updateData]));

  useEventSubscription('ticket-deleted', useCallback(() => {
    if (eventTypes.includes('ticket-deleted')) {
      updateData(true);
    }
  }, [eventTypes, updateData]));

  useEventSubscription('notification-created', useCallback(() => {
    if (eventTypes.includes('notification-created')) {
      updateData(true);
    }
  }, [eventTypes, updateData]));

  useEventSubscription('notification-read', useCallback(() => {
    if (eventTypes.includes('notification-read')) {
      updateData(true);
    }
  }, [eventTypes, updateData]));

  // 🚀 Carga inicial (una sola vez)
  useEffect(() => {
    if (enabled && mountedRef.current) {
      updateData(true);
    }
  }, [enabled, endpoint, ...dependencies]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Funciones de control manual
  const forceUpdate = useCallback(() => updateData(true), [updateData]);
  
  const clearCache = useCallback(() => {
    updateCache.delete(finalCacheKey);
  }, [finalCacheKey]);

  return {
    data,
    isLoading,
    error,
    forceUpdate,
    clearCache,
    triggerEvent // Para que los componentes puedan disparar eventos
  };
}