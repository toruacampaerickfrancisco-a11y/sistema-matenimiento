"use client";

import { useState, useEffect } from 'react';
import styles from './MobileBottomNav.module.css';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: string;
}

export default function MobileBottomNav({ activeTab, onTabChange, userRole }: MobileBottomNavProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // No mostrar en desktop
  if (!isMobile) return null;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '🏠',
      roles: ['admin', 'tecnico', 'technician']
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: '📊',
      roles: ['admin', 'tecnico', 'technician', 'user']
    },
    {
      id: 'tickets',
      label: 'Tickets',
      icon: '📋',
      roles: ['admin', 'tecnico', 'technician', 'user']
    },
    {
      id: 'usuarios',
      label: 'Usuarios',
      icon: '👤',
      roles: ['admin']
    },
    {
      id: 'equipos',
      label: 'Equipos',
      icon: '🖥️',
      roles: ['admin', 'tecnico', 'technician']
    }
  ];

  // Filtrar elementos según el rol del usuario
  const visibleItems = navItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className={styles.bottomNav}>
      {visibleItems.map((item) => (
        <button
          key={item.id}
          className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
          onClick={() => onTabChange(item.id)}
        >
          <div className={styles.navIcon}>{item.icon}</div>
          <span className={styles.navLabel}>{item.label}</span>
          {activeTab === item.id && <div className={styles.activeIndicator} />}
        </button>
      ))}
    </div>
  );
}