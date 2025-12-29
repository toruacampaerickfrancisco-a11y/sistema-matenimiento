'use client';

import React, { createContext, useContext, useCallback, useState } from 'react';

// Tipos de eventos que pueden desencadenar actualizaciones
export type UpdateEventType = 
  | 'user-created' 
  | 'user-updated' 
  | 'user-deleted'
  | 'equipment-created' 
  | 'equipment-updated' 
  | 'equipment-deleted'
  | 'ticket-created' 
  | 'ticket-updated' 
  | 'ticket-deleted'
  | 'notification-created'
  | 'notification-read';

// Suscriptores para cada tipo de evento
type UpdateSubscriber = () => void;
type UpdateSubscribers = {
  [K in UpdateEventType]: Set<UpdateSubscriber>
};

interface UpdateContextType {
  // Registrar suscriptor para un tipo de evento específico
  subscribe: (eventType: UpdateEventType, callback: UpdateSubscriber) => () => void;
  
  // Disparar evento de actualización
  trigger: (eventType: UpdateEventType, data?: any) => void;
  
  // Obtener estadísticas de suscriptores
  getStats: () => Record<UpdateEventType, number>;
}

const UpdateContext = createContext<UpdateContextType | null>(null);

export function UpdateProvider({ children }: { children: React.ReactNode }) {
  const [subscribers] = useState<UpdateSubscribers>(() => {
    const initial = {} as UpdateSubscribers;
    
    // Inicializar todos los tipos de evento con Sets vacíos
    const eventTypes: UpdateEventType[] = [
      'user-created', 'user-updated', 'user-deleted',
      'equipment-created', 'equipment-updated', 'equipment-deleted',
      'ticket-created', 'ticket-updated', 'ticket-deleted',
      'notification-created', 'notification-read'
    ];
    
    eventTypes.forEach(type => {
      initial[type] = new Set();
    });
    
    return initial;
  });

  // 🎯 Suscribirse a eventos específicos
  const subscribe = useCallback((eventType: UpdateEventType, callback: UpdateSubscriber) => {
    subscribers[eventType].add(callback);
    
    // Retornar función de desuscripción
    return () => {
      subscribers[eventType].delete(callback);
    };
  }, [subscribers]);

  // 🔥 Disparar evento de actualización específico
  const trigger = useCallback((eventType: UpdateEventType, data?: any) => {
    // Ejecutar todas las callbacks suscritas a este evento
    subscribers[eventType].forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error(`Error en suscriptor de ${eventType}:`, error);
      }
    });
    
    // Log solo en desarrollo para debuggear
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 Evento ${eventType} disparado - ${subscribers[eventType].size} suscriptores notificados`);
    }
  }, [subscribers]);

  // 📊 Obtener estadísticas de suscriptores
  const getStats = useCallback(() => {
    const stats = {} as Record<UpdateEventType, number>;
    Object.entries(subscribers).forEach(([eventType, set]) => {
      stats[eventType as UpdateEventType] = set.size;
    });
    return stats;
  }, [subscribers]);

  return (
    <UpdateContext.Provider value={{ subscribe, trigger, getStats }}>
      {children}
    </UpdateContext.Provider>
  );
}

// Hook para usar el contexto de actualizaciones
export function useUpdateContext() {
  const context = useContext(UpdateContext);
  if (!context) {
    throw new Error('useUpdateContext debe usarse dentro de UpdateProvider');
  }
  return context;
}

// Hook especializado para suscribirse a eventos específicos
export function useEventSubscription(eventType: UpdateEventType, callback: UpdateSubscriber) {
  const { subscribe } = useUpdateContext();
  
  React.useEffect(() => {
    const unsubscribe = subscribe(eventType, callback);
    return unsubscribe;
  }, [subscribe, eventType, callback]);
}

// Hook para disparar eventos
export function useEventTrigger() {
  const { trigger } = useUpdateContext();
  return trigger;
}