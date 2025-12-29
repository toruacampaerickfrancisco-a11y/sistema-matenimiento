import { useEffect, useState, useCallback, useRef } from 'react';

interface RealtimeEvent {
  type: string;
  data?: any;
  timestamp: string;
  message?: string;
}

interface UseRealtimeOptions {
  userId: string;
  onEvent?: (event: RealtimeEvent) => void;
  reconnectInterval?: number;
  enableSmartUpdates?: boolean;
}

export function useRealtime({ userId, onEvent, reconnectInterval = 15000, enableSmartUpdates = true }: UseRealtimeOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const connect = useCallback(() => {
    if (!userId) return;

    try {
      // Cerrar conexión existente si existe
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const eventSource = new EventSource(`/api/events?userId=${userId}`);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.debug('Connected to realtime events');
        setIsConnected(true);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      eventSource.onmessage = (event) => {
        try {
          const eventData: RealtimeEvent = JSON.parse(event.data);
          setLastEvent(eventData);
          
          // Sistema de throttling inteligente para evitar actualizaciones muy frecuentes
          const now = Date.now();
          const timeSinceLastUpdate = now - lastUpdateRef.current;
          
          if (eventData.type !== 'ping') {
            // Solo procesar eventos importantes si han pasado al menos 30 segundos
            if (!enableSmartUpdates || timeSinceLastUpdate >= 30000 || eventData.type === 'connected' || eventData.type === 'new-ticket-for-technicians') {
              if (onEvent) {
                onEvent(eventData);
              }
              lastUpdateRef.current = now;
              
              // Log solo para eventos importantes en desarrollo
              if (process.env.NODE_ENV === 'development' && eventData.type !== 'connected') {
                console.debug(`📡 Evento procesado: ${eventData.type}`);
              }
            }
            // Eliminar logs de eventos diferidos para reducir spam
          }
        } catch (error) {
          console.error('❌ Error procesando evento:', error);
        }
      };

      eventSource.onerror = () => {
        console.debug('SSE connection error, reconnecting...');
        setIsConnected(false);
        eventSource.close();
        
        // Reconectar automáticamente
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

    } catch (error) {
      console.error('❌ Error creando EventSource:', error);
      setIsConnected(false);
    }
  }, [userId, onEvent, reconnectInterval]);

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
  }, []);

  // Función para obtener datos actualizados
  const fetchUpdatedData = useCallback(async (type: string) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, userId }),
      });
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error(`❌ Error obteniendo datos ${type}:`, error);
      return null;
    }
  }, [userId]);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    lastEvent,
    connect,
    disconnect,
    fetchUpdatedData,
  };
}

export default useRealtime;