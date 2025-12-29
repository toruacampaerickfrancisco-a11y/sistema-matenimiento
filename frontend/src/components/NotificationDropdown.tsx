import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCheck, Ticket, Clock, AlertCircle } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import styles from './NotificationDropdown.module.css';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleNotificationClick = async (notification: any) => {
    // Marcar como leída
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // Navegar al ticket correspondiente si existe
    if (notification.ticketId) {
      navigate('/tickets');
      // Aquí se podría abrir directamente el ticket específico
    }

    onClose();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_ticket':
        return <Ticket size={18} className={styles.iconNewTicket} />;
      case 'ticket_assigned':
        return <Clock size={18} className={styles.iconAssigned} />;
      case 'ticket_updated':
        return <AlertCircle size={18} className={styles.iconUpdated} />;
      case 'ticket_closed':
        return <CheckCheck size={18} className={styles.iconClosed} />;
      default:
        return <AlertCircle size={18} className={styles.iconDefault} />;
    }
  };

  const formatTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: es
    });
  };

  const recentNotifications = notifications.slice(0, 10);

  return (
    <div ref={dropdownRef} className={styles.dropdown}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span>Notificaciones</span>
          {unreadCount > 0 && (
            <span className={styles.unreadBadge}>
              {unreadCount}
            </span>
          )}
        </div>
        <div className={styles.headerActions}>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className={styles.markAllButton}
              title="Marcar todas como leídas"
            >
              <CheckCheck size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className={styles.closeButton}
            title="Cerrar"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {recentNotifications.length === 0 ? (
          <div className={styles.empty}>
            <AlertCircle size={48} className={styles.emptyIcon} />
            <p>No tienes notificaciones</p>
          </div>
        ) : (
          <div className={styles.notificationList}>
            {recentNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`${styles.notificationItem} ${
                  !notification.isRead ? styles.unread : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className={styles.notificationIcon}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className={styles.notificationContent}>
                  <div className={styles.notificationTitle}>
                    {notification.title}
                  </div>
                  <div className={styles.notificationMessage}>
                    {notification.message}
                  </div>
                  <div className={styles.notificationTime}>
                    {formatTime(notification.createdAt)}
                  </div>
                </div>

                {!notification.isRead && (
                  <div className={styles.unreadDot} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <button
          onClick={() => {
            navigate('/notificaciones');
            onClose();
          }}
          className={styles.viewAllButton}
        >
          Ver todas las notificaciones
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;