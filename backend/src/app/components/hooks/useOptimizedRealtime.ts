import { useEffect, useState, useRef, useCallback } from 'react';

interface RealtimeEvent {
  type: string;
  data?: any;
  timestamp: string;
  message?: string;
}

interface UseOptimizedRealtimeOptions {
  userId: string;
  onEvent?: (event: RealtimeEvent) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useOptimizedRealtime({ 
  userId, 
  onEvent, 
  reconnectInterval = 45000, // 45 segundos
  maxReconnectAttempts = 5 
}: UseOptimizedRealtimeOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const lastEventTimeRef = useRef<number>(0);
  const connectionIdRef = useRef<string>('');

  const connect = useCallback(() => {
    if (!userId) return;

    try {
      // Limpiar conexión anterior
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Crear nueva conexión con ID único para evitar duplicados
      const connectionId = `${userId}-${Date.now()}`;
      connectionIdRef.current = connectionId;
      
      const eventSource = new EventSource(`/api/events?userId=${userId}&connId=${connectionId}`);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.debug('📡 Conexión SSE establecida');
        }
      };

      eventSource.onmessage = (event) => {
        try {
          const eventData: RealtimeEvent = JSON.parse(event.data);
          const now = Date.now();
          
          // Evitar procesar eventos duplicados muy seguidos
          if (now - lastEventTimeRef.current < 5000 && eventData.type === 'ping') {
            return;
          }
          
          setLastEvent(eventData);
          lastEventTimeRef.current = now;
          
          // Solo procesar eventos importantes
          if (eventData.type !== 'ping' && onEvent) {
            onEvent(eventData);
            
            if (process.env.NODE_ENV === 'development') {
              console.debug(`📨 Evento SSE: ${eventData.type}`);
            }
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.debug('❌ Error procesando evento SSE:', error);
          }
        }
      };

      eventSource.onerror = () => {
        setIsConnected(false);
        eventSource.close();
        
        // Reconectar solo si no hemos superado el límite de intentos
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          
          if (!reconnectTimeoutRef.current) {
            const delay = Math.min(reconnectInterval * reconnectAttemptsRef.current, 180000); // Max 3 minutos
            
            reconnectTimeoutRef.current = setTimeout(() => {
              if (process.env.NODE_ENV === 'development') {
                console.debug(`🔄 Reintentando conexión SSE (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
              }
              connect();
            }, delay);
          }
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.debug('⚠️ Máximo de reintentos SSE alcanzado, deteniendo');
          }
        }
      };

    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('❌ Error creando conexión SSE:', error);
      }
      setIsConnected(false);
    }
  }, [userId, onEvent, reconnectInterval, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setIsConnected(false);
    reconnectAttemptsRef.current = 0;
  }, []);

  useEffect(() => {
    if (userId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [userId, connect, disconnect]);

  return {
    isConnected,
    lastEvent,
    reconnect: connect,
    disconnect
  };
}