"use client";

import { useState, useEffect } from 'react';
import MobileBottomNav from './MobileBottomNav';
import styles from './MobileLayout.module.css';

interface MobileLayoutProps {
  currentUser: any;
}

export default function MobileLayout({ currentUser }: MobileLayoutProps) {
  const [activeTab, setActiveTab] = useState('tickets');
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

  const renderContent = () => {
    switch (activeTab) {
      case 'usuarios':
        return (
          <div className={styles.tabContent}>
            <div className={styles.header}>
              <h2>👤 Usuarios</h2>
              <p>Gestión de usuarios del sistema</p>
            </div>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p>Vista de usuarios en desarrollo...</p>
            </div>
          </div>
        );

      case 'equipos':
        return (
          <div className={styles.tabContent}>
            <div className={styles.header}>
              <h2>🖥️ Equipos</h2>
              <p>Inventario y asignación de equipos</p>
            </div>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p>Vista de equipos en desarrollo...</p>
            </div>
          </div>
        );

      case 'tickets':
        return (
          <div className={styles.tabContent}>
            <div className={styles.header}>
              <h2>📋 Tickets</h2>
              <p>Solicitudes y órdenes de trabajo</p>
            </div>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p>Vista de tickets en desarrollo...</p>
            </div>
          </div>
        );

      case 'permisos':
        return (
          <div className={styles.tabContent}>
            <div className={styles.header}>
              <h2>⚙️ Permisos</h2>
              <p>Gestión de roles y permisos</p>
            </div>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p>Vista de permisos en desarrollo...</p>
            </div>
          </div>
        );

      case 'perfil':
        return (
          <div className={styles.tabContent}>
            <div className={styles.header}>
              <h2>👨‍💼 Mi Perfil</h2>
              <p>Información personal y configuración</p>
            </div>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p>Perfil: {currentUser?.name || 'Usuario'}</p>
              <p>Rol: {currentUser?.role || 'Sin rol'}</p>
              <p>Email: {currentUser?.email || 'Sin email'}</p>
            </div>
          </div>
        );

      default:
        return (
          <div className={styles.tabContent}>
            <div className={styles.header}>
              <h2>🏠 Dashboard</h2>
              <p>Panel principal del sistema</p>
            </div>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p>¡Bienvenido {currentUser?.name || 'Usuario'}!</p>
              <p>Sistema de Mantenimiento - Versión Móvil</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.mobileLayout}>
      <div className={styles.content}>
        {renderContent()}
      </div>
      
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userRole={currentUser?.role || 'user'}
      />
    </div>
  );
}