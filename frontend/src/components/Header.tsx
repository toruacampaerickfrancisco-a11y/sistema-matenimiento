import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth.tsx';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationDropdown from './NotificationDropdown';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <header className={styles.header}>
      {/* Siluetas decorativas */}
      <div className={styles.landscapeElements}>
        <div className={styles.cactus1}></div>
        <div className={styles.cactus2}></div>
        <div className={styles.hill1}></div>
        <div className={styles.hill2}></div>
      </div>
      
      <div className={styles.headerLeft}>
        <div className={styles.dateTime}>
          <div className={styles.date}>{currentDate}</div>
          <div className={styles.time}>{currentTime}</div>
        </div>
      </div>

      <div className={styles.headerRight}>
        <div className={styles.headerActions}>
          {/* Notificaciones */}
          <div className={styles.notificationContainer}>
            <button
              className={styles.notificationButton}
              onClick={toggleNotifications}
              title="Notificaciones"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className={styles.notificationBadge}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <NotificationDropdown 
                onClose={() => setShowNotifications(false)} 
              />
            )}
          </div>
        </div>

        {/* Avatar del usuario */}
        <div 
          className={styles.userAvatar}
          title={`${user?.fullName} - ${user?.role === 'admin' ? 'Administrador' : user?.role === 'tecnico' ? 'Técnico' : 'Usuario'}`}
          onClick={() => navigate('/perfil')}
        >
          {user?.fullName?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Header;