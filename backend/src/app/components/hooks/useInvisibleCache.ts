// Sistema de caché inteligente para evitar re-renders innecesarios
import { useState, useRef, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  hash: string;
  timestamp: number;
}

export function useInvisibleCache<T>(cacheKey: string, ttl: number = 300000) { // 5 minutos TTL
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
  const [, forceUpdate] = useState({});

  // Generar hash de los datos para comparación
  const generateHash = useCallback((data: T): string => {
    try {
      return btoa(JSON.stringify(data)).substring(0, 16);
    } catch {
      return String(Date.now());
    }
  }, []);

  // Obtener datos del caché
  const get = useCallback((key: string): T | null => {
    const entry = cacheRef.current.get(key);
    if (!entry) return null;
    
    // Verificar si el TTL ha expirado
    if (Date.now() - entry.timestamp > ttl) {
      cacheRef.current.delete(key);
      return null;
    }
    
    return entry.data;
  }, [ttl]);

  // Establecer datos en el caché solo si son diferentes
  const set = useCallback((key: string, data: T): boolean => {
    const newHash = generateHash(data);
    const existing = cacheRef.current.get(key);
    
    // Si el hash es el mismo, no hay cambios
    if (existing && existing.hash === newHash) {
      return false; // No hubo cambios
    }
    
    // Guardar nueva entrada
    cacheRef.current.set(key, {
      data,
      hash: newHash,
      timestamp: Date.now()
    });
    
    return true; // Hubo cambios
  }, [generateHash]);

  // Limpiar caché expirado
  const cleanup = useCallback(() => {
    const now = Date.now();
    for (const [key, entry] of cacheRef.current.entries()) {
      if (now - entry.timestamp > ttl) {
        cacheRef.current.delete(key);
      }
    }
  }, [ttl]);

  // Forzar actualización solo si hay cambios reales
  const updateIfChanged = useCallback((key: string, newData: T): boolean => {
    const hasChanges = set(key, newData);
    if (hasChanges) {
      forceUpdate({}); // Forzar re-render solo si hay cambios
    }
    return hasChanges;
  }, [set]);

  return {
    get,
    set,
    updateIfChanged,
    cleanup,
    has: (key: string) => cacheRef.current.has(key),
    clear: () => cacheRef.current.clear()
  };
}