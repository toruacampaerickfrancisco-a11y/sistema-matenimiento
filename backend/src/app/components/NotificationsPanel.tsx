import React, { useEffect, useState, useCallback } from 'react';
import { NotificationSound } from './NotificationSound';
import { usePreciseUpdates } from './hooks/usePreciseUpdates';

interface Notification {
  id: string;
  message: string;
  createdAt: string;
  read: number;
}

export default function NotificationsPanel({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [previousCount, setPreviousCount] = useState(0);

  // 🎯 Sistema de notificaciones por eventos precisos con sonido optimizado
  const { data: notificationsData, triggerEvent } = usePreciseUpdates({
    endpoint: `/api/notifications?userId=${userId}`,
    eventTypes: ['notification-created', 'notification-read'],
    enabled: !!userId,
    dependencies: [userId],
    cacheKey: `notifications-${userId}`,
    onUpdate: (data: any) => {
      const newNotifications = data.notifications || [];
      const unreadCount = newNotifications.filter((n: Notification) => n.read === 0).length;
      
      // 🔊 Reproducir sonido solo si hay MÁS notificaciones no leídas
      if (unreadCount > previousCount && previousCount >= 0) {
        NotificationSound.playNotificationBeep();
      }
      
      // Las no leídas aparecen primero, luego las leídas por fecha
      const sortedNotifications = newNotifications.sort((a: Notification, b: Notification) => {
        if (a.read !== b.read) {
          return a.read - b.read; // No leídas (0) primero
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Más recientes primero
      });
      
      setNotifications(sortedNotifications);
      setPreviousCount(unreadCount);
    }
  });

  // 🚀 Función para marcar notificación como leída y eliminar automáticamente
  const markAsReadAndDelete = useCallback(async (notificationId: string) => {
    try {
      // Primero marcar como leída
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'markRead',
          notificationId,
          userId
        })
      });

      // Luego eliminar después de 2 segundos para que el usuario vea que se marcó como leída
      setTimeout(async () => {
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'delete',
            notificationId,
            userId
          })
        });
        
        // Actualizar estado local inmediatamente
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        // Eliminación silenciosa
      }, 2000);

      // Actualizar estado local inmediatamente para mostrar como leída
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: 1 } : n)
      );
      
      // 🔥 Disparar evento de notificación leída
      triggerEvent('notification-read', { notificationId });
      
    } catch (error) {
      console.error('❌ Error marcando notificación:', error);
    }
  }, [userId, triggerEvent]);

  // 🧹 Función para limpiar todas las notificaciones leídas
  const clearReadNotifications = useCallback(async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteAllRead',
          userId
        })
      });
      
      // Actualizar estado local
      setNotifications(prev => prev.filter(n => n.read === 0));
      // Limpieza silenciosa
      
    } catch (error) {
      console.error('❌ Error limpiando notificaciones:', error);
    }
  }, [userId]);

  // Carga inicial (solo una vez con loading visible)
  useEffect(() => {
    if (!userId) return;
    
    const loadInitialNotifications = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/notifications?userId=${userId}`);
        const data = await response.json();
        const initialNotifications = data.notifications || [];
        const unreadCount = initialNotifications.filter((n: Notification) => n.read === 0).length;
        
        setNotifications(initialNotifications);
        setPreviousCount(unreadCount);
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialNotifications();
  }, [userId]);

  if (!userId) return null;

  const unreadCount = notifications.filter(n => n.read === 0).length;

  return (
    <div style={{marginBottom: 24}}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <h3 style={{color:'#a11a53', margin: 0}}>Notificaciones</h3>
        {unreadCount > 0 && (
          <span style={{
            backgroundColor: '#7b1343', 
            color: 'white', 
            borderRadius: '50%', 
            padding: '4px 8px', 
            fontSize: '12px',
            fontWeight: 'bold',
            minWidth: '20px',
            textAlign: 'center'
          }}>
            {unreadCount}
          </span>
        )}
        {NotificationSound.isAudioSupported() && (
          <button 
            onClick={() => NotificationSound.playNotificationBeep()}
            style={{
              background: 'none',
              border: '1px solid #7b1343',
              color: '#7b1343',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
            title="Probar sonido de notificación"
          >
            🔊 Test
          </button>
        )}
        {notifications.filter(n => n.read === 1).length > 0 && (
          <button 
            onClick={clearReadNotifications}
            style={{
              background: '#dc3545',
              border: 'none',
              color: 'white',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
            title="Limpiar notificaciones leídas"
          >
            🧹 Limpiar
          </button>
        )}
      </div>
      
      {loading ? <div>Cargando notificaciones...</div> : null}
      {notifications.length === 0 && !loading ? (
        <div style={{color: '#666', fontStyle: 'italic'}}>No hay notificaciones.</div>
      ) : null}
      
      {notifications.filter(n => n.read === 1).length > 0 && (
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '6px',
          padding: '8px',
          marginBottom: '10px',
          fontSize: '12px',
          color: '#6c757d'
        }}>
          💡 Tienes {notifications.filter(n => n.read === 1).length} notificación(es) leída(s). 
          Usa el botón "🧹 Limpiar" para eliminarlas del panel.
        </div>
      )}
      
      <ul style={{listStyle:'none', padding:0, maxHeight: '300px', overflowY: 'auto'}}>
        {notifications.map(n => (
          <li 
            key={n.id} 
            onClick={() => n.read === 0 ? markAsReadAndDelete(n.id) : undefined}
            style={{
              background: n.read ? "#f8f9fa" : "#ffe6ef",
              marginBottom: 8,
              padding: 12,
              borderRadius: 8,
              border: n.read ? "1px solid #dee2e6" : "2px solid #7b1343",
              transition: 'all 0.3s ease',
              cursor: n.read === 0 ? 'pointer' : 'default',
              position: 'relative'
            }}
            title={n.read === 0 ? 'Clic para marcar como leída y eliminar' : 'Notificación leída'}
          >
            <div style={{
              fontWeight: n.read ? 400 : 700,
              color: n.read ? '#333' : '#7b1343'
            }}>
              {n.read === 0 && (
                <span style={{
                  backgroundColor: '#7b1343',
                  color: 'white',
                  borderRadius: '50%',
                  width: '8px',
                  height: '8px',
                  display: 'inline-block',
                  marginRight: '8px'
                }}></span>
              )}
              {n.message}
            </div>
            <div style={{fontSize:12, color:'#888', marginTop: 4}}>
              {new Date(n.createdAt).toLocaleString('es-MX', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
              {n.read === 0 && (
                <span style={{
                  marginLeft: '10px',
                  color: '#7b1343',
                  fontWeight: 'bold',
                  fontSize: '10px'
                }}>
                  ← Clic para leer
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
