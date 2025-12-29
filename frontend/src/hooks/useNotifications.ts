import { useState, useEffect } from 'react';
import { Notification } from '@/types';
import { useAuth } from './useAuth';
import { notificationService } from '@/services/notificationService';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  // Cargar notificaciones iniciales
  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications();
      
      // Recuperar notificaciones leídas de sessionStorage
      const readNotifications = JSON.parse(sessionStorage.getItem('readNotifications') || '[]');
      
      // Marcar como leídas las que estén en sessionStorage
      const processedData = data.map(notification => ({
        ...notification,
        isRead: notification.isRead || readNotifications.includes(notification.id)
      }));

      setNotifications(processedData);
      updateUnreadCount(processedData);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUnreadCount = (notificationList: Notification[]) => {
    const count = notificationList.filter(n => !n.isRead).length;
    setUnreadCount(count);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Guardar en sessionStorage
      const readNotifications = JSON.parse(sessionStorage.getItem('readNotifications') || '[]');
      if (!readNotifications.includes(notificationId)) {
        readNotifications.push(notificationId);
        sessionStorage.setItem('readNotifications', JSON.stringify(readNotifications));
      }

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      
      // Guardar todos los IDs actuales en sessionStorage
      const readNotifications = JSON.parse(sessionStorage.getItem('readNotifications') || '[]');
      const currentIds = notifications.map(n => n.id);
      const newReadList = [...new Set([...readNotifications, ...currentIds])];
      sessionStorage.setItem('readNotifications', JSON.stringify(newReadList));

      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.isRead) {
      setUnreadCount(prev => prev + 1);
    }
    
    // Reproducir sonido de notificación
    playNotificationSound(notification.type);
  };

  const playNotificationSound = (type: string) => {
    // Crear un sonido diferente según el tipo de notificación
    const audio = new Audio();
    
    switch (type) {
      case 'new_ticket':
        // Sonido más prominente para nuevos tickets
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzSJzO/XdiMFl';
        break;
      case 'ticket_assigned':
        // Sonido suave para asignaciones
        audio.src = 'data:audio/wav;base64,UklGRsYHAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YaIHAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzSJzO/XdiMF';
        break;
      default:
        // Sonido por defecto
        audio.src = 'data:audio/wav;base64,UklGRsYHAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YaIHAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzSJzO/XdiMF';
    }
    
    audio.volume = 0.3; // Volumen moderado
    audio.play().catch(() => {
      // Ignorar errores de reproducción (puede estar deshabilitado por el navegador)
    });
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    addNotification,
    loadNotifications
  };
};