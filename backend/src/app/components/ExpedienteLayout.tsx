"use client";

import React, { useEffect, useState } from 'react';
import styles from './expediente.module.css';
import dynamic from 'next/dynamic';
import NotificationBell from './NotificationBell';
import RealtimeIndicator from './RealtimeIndicator';
import { useRealtime } from './hooks/useRealtime';
import { useAutoLayout } from './hooks/useAutoLayout';

// ✅ Importaciones dinámicas mejoradas con mejor manejo de errores
const UsersTable = dynamic(() => import('./UsersTable'), { 
  loading: () => <div>Cargando usuarios...</div> 
});
const EquipmentTable = dynamic(() => import('./EquipmentTable'), { 
  loading: () => <div>Cargando equipos...</div> 
});
const TicketList = dynamic(() => import('./TicketList'), { 
  loading: () => <div>Cargando tickets...</div> 
});
const UserProfile = dynamic(() => import('./UserProfile'), { 
  loading: () => <div>Cargando perfil...</div> 
});
const ReportForm = dynamic(() => import('./ReportForm'), { 
  loading: () => <div>Cargando reportes...</div> 
});
const PermissionsManager = dynamic(() => import('./PermissionsManager'), { 
  loading: () => <div>Cargando permisos...</div> 
});
const Settings = dynamic(() => import('./Settings'), { 
  loading: () => <div>Cargando configuración...</div> 
});
const Dashboard = dynamic(() => import('./Dashboard'), { 
  loading: () => <div>Cargando dashboard...</div> 
});
const NotificationsPanelDynamic = dynamic(() => import('./NotificationsPanelDynamic'), { 
  ssr: false,
  loading: () => <div>Cargando notificaciones...</div>
});

export default function ExpedienteLayout({ children, name }: { children: React.ReactNode; name: string }) {
  const [userId, setUserId] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) {
        const u = JSON.parse(raw);
        if (u && u.id) setUserId(u.id);
      }
    } catch (_) {}
  }, []);
  const [displayName, setDisplayName] = useState<string>(name || '');
  const [role, setRole] = useState<string>('user');
  const [permissions, setPermissions] = useState<any>(null);
  const [activeModule, setActiveModule] = useState<'dashboard'|'profile'|'reports'|'users'|'equipment'|'tickets'|'perms'|'settings'|'none'>('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [customBanner, setCustomBanner] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // show the system name in the header instead of the photo when true
  // stored as 'useBannerText' in localStorage; default to true to match user's request
  const [useBannerText, setUseBannerText] = useState<boolean>(true);

  // 🎯 Auto-layout system - temporalmente deshabilitado para evitar errores SSR
  // const { screenInfo, layoutConfig, recalculate } = useAutoLayout();
  
  // Valores por defecto temporales
  const screenInfo = { 
    type: 'desktop', 
    category: 'desktop',
    width: 1920, 
    height: 1080,
    aspectRatio: 1.78,
    density: 'normal'
  };
  const layoutConfig = { sidebarWidth: 240, contentMaxWidth: 1400, contentPadding: 30 };
  const recalculate = () => {};

  // TEMPORALMENTE DESHABILITADO para optimización
  // const { isConnected } = useRealtime({
  //   userId: userId || 'guest',
  //   onEvent: (event) => {
  //     console.log('📡 Evento recibido en layout:', event.type);
  //   },
  // });
  const isConnected = false; // Placeholder temporal

  useEffect(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) {
        const u = JSON.parse(raw);
        if (u && u.name) setDisplayName(u.name);
        if (u && u.role) {
          setRole(u.role);
          
          // 🏷️ Actualizar título de página según el rol
          const roleTitles = {
            admin: '👨‍💼⚙️ Admin - Sistema Interno de Mantenimiento 🔧💻',
            tecnico: '🔧👨‍🔧 Técnico - Sistema Interno de Mantenimiento 🖥️⚙️',
            user: '👤💻 Usuario - Sistema Interno de Mantenimiento ⚙️🔧'
          };
          
          const newTitle = roleTitles[u.role as keyof typeof roleTitles] || '🖥️⚙️ Sistema Interno - Mantenimiento de Equipos 🔧💻';
          document.title = newTitle;
        }
      }
    } catch (_) {}
  }, []);

  // 🎯 Manejar parámetro URL para abrir tickets automáticamente
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const openTicketId = urlParams.get('open');
    
    if (openTicketId) {
      // Cambiar automáticamente al módulo de tickets
      setActiveModule('tickets');
    }
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('appPermissions');
      if (raw) setPermissions(JSON.parse(raw));
      else setPermissions(null);
    } catch (_) { setPermissions(null); }

    // Cargar banner personalizado
    const banner = localStorage.getItem('customBanner');
    if (banner) {
      setCustomBanner(banner);
    }
    // Load header mode (text vs image)
    try {
      const t = localStorage.getItem('useBannerText');
      if (t !== null) setUseBannerText(t === 'true');
      else setUseBannerText(true);
    } catch (_) {
      setUseBannerText(true);
    }
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <section className={styles.content}>
          {/* Botón para toggle del sidebar */}
          <button 
            className={styles.sidebarToggle}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Mostrar/Ocultar menú"
          >
            {sidebarCollapsed ? '☰' : '×'}
          </button>

          {/* Banner superior con información del usuario */}
          <div className={styles.topBanner}>
            <div className={styles.bannerLeft}>
              <h2 className={styles.currentSection}>
                {activeModule === 'dashboard' && 'Panel de Control'}
                {activeModule === 'users' && 'Gestión de Usuarios'}
                {activeModule === 'equipment' && 'Gestión de Equipos'}
                {activeModule === 'tickets' && 'Mesa de Ayuda'}
                {activeModule === 'reports' && 'Reportes Oficiales'}
                {activeModule === 'profile' && 'Mi Perfil'}
                {activeModule === 'settings' && 'Configuración del Sistema'}
                {activeModule === 'perms' && 'Gestión de Permisos'}
              </h2>
              {/* Indicador avanzado de pantalla y autoajuste */}
              {isClient && (
                <div className={styles.screenIndicator}>
                  📱 {screenInfo.type} • {screenInfo.category} • {screenInfo.width}×{screenInfo.height}
                  {screenInfo.aspectRatio > 2.2 && ' • Wide'}
                  {screenInfo.density === 'high' && ' • Retina'}
                  • Sidebar: {layoutConfig.sidebarWidth}px
                </div>
              )}
            </div>
            
            <div className={styles.bannerRight}>
              <div className={styles.userBannerInfo}>
                <span className={styles.userName}>{displayName || 'Usuario'}</span>
                <span className={styles.userRole}>
                  {role === 'admin' ? 'Administrador' : role === 'tecnico' ? 'Técnico' : 'Usuario'}
                </span>
              </div>
              
              {/* Campana de notificaciones */}
              {isClient && userId && (
                <div className={styles.bannerNotifications}>
                  <NotificationBell userId={userId} />
                </div>
              )}
              
              {/* Avatar del usuario */}
              <button
                className={styles.bannerAvatar}
                aria-label="Menú de usuario"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {displayName ? displayName.slice(0, 2).toUpperCase() : '?'}
              </button>
              
              {/* Menú desplegable del usuario */}
              {showUserMenu && (
                <div className={styles.bannerUserMenu} role="menu">
                  <button className={styles.userMenuItem} onClick={() => { setActiveModule('profile'); setShowUserMenu(false); }}>Mis Datos</button>
                  {role === 'admin' && (
                    <>
                      <div className={styles.userMenuDivider}></div>
                      <button className={styles.userMenuItem} onClick={() => { setActiveModule('perms'); setShowUserMenu(false); }}>Permisos</button>
                      <button className={styles.userMenuItem} onClick={() => { setActiveModule('settings'); setShowUserMenu(false); }}>Configuración</button>
                    </>
                  )}
                  <div className={styles.userMenuDivider}></div>
                  <button className={styles.userMenuItem} onClick={() => { localStorage.removeItem('currentUser'); window.location.href = '/'; }}>Cerrar sesión</button>
                </div>
              )}
            </div>
          </div>
          
          <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
            {/* Header integrado en el sidebar */}
            <div className={styles.sidebarHeader}>
              <div className={styles.sidebarLogo}>
                <div className={styles.logoText}>
                  <div className={styles.systemTitle}>SISTEMA DE GESTIÓN</div>
                  <div className={styles.systemSubtitle}>DE MANTENIMIENTO</div>
                </div>
              </div>
            </div>

            {/* 🚀 Menú de navegación unificado */}
            <div className={styles.sidebarNav}>
              {/* Navegación Principal */}
              <div className={styles.navSection}>
                <div className={styles.navSectionTitle}>Navegación</div>
                <ul className={styles.navList}>
                  {(role === 'admin' || role === 'tecnico') && (
                    <li 
                      className={activeModule === 'dashboard' ? styles.sidebarItemActive : styles.sidebarItem} 
                      onClick={() => setActiveModule('dashboard')}
                    >
                      <span className={styles.navIcon}></span>
                      <span>Dashboard</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Solicitantes */}
              <div className={styles.navSection}>
                <div className={styles.navSectionTitle}>Solicitantes</div>
                <ul className={styles.navList}>
                  {(!permissions || (permissions[role] ? permissions[role].reports : true)) && (
                    <li 
                      className={activeModule === 'reports' ? styles.sidebarItemActive : styles.sidebarItem} 
                      onClick={() => setActiveModule('reports')}
                    >
                      <span className={styles.navIcon}></span>
                      <span>Reportes</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Administración */}
              <div className={styles.navSection}>
                <div className={styles.navSectionTitle}>Administración</div>
                <ul className={styles.navList}>
                  {(role === 'admin' || (permissions && permissions[role] && permissions[role].users)) && (
                    <li 
                      className={activeModule === 'users' ? styles.sidebarItemActive : styles.sidebarItem} 
                      onClick={() => setActiveModule('users')}
                    >
                      <span className={styles.navIcon}></span>
                      <span>Usuarios</span>
                    </li>
                  )}
                  {(role === 'admin' || (permissions && permissions[role] && permissions[role].equipment)) && (
                    <li 
                      className={activeModule === 'equipment' ? styles.sidebarItemActive : styles.sidebarItem} 
                      onClick={() => setActiveModule('equipment')}
                    >
                      <span className={styles.navIcon}></span>
                      <span>Equipos</span>
                    </li>
                  )}
                  {(role === 'admin' || role === 'tecnico') && (
                    <li 
                      className={activeModule === 'tickets' ? styles.sidebarItemActive : styles.sidebarItem} 
                      onClick={() => setActiveModule('tickets')}
                    >
                      <span className={styles.navIcon}></span>
                      <span>Tickets</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Configuración */}
              <div className={styles.navSection}>
                <div className={styles.navSectionTitle}>Configuración</div>
                <ul className={styles.navList}>
                  {role === 'admin' && (
                    <li 
                      className={activeModule === 'perms' ? styles.sidebarItemActive : styles.sidebarItem} 
                      onClick={() => setActiveModule('perms')}
                    >
                      <span className={styles.navIcon}></span>
                      <span>Permisos</span>
                    </li>
                  )}
                  <li>
                    <button 
                      className={styles.logoutButton} 
                      onClick={() => { 
                        localStorage.removeItem('currentUser'); 
                        window.location.href = '/'; 
                      }}
                      style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0 }}
                    >
                      <span className={styles.navIcon}></span>
                      <span>Salir</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          <div className={styles.panel}>
            <div className={styles.panelInner}>
              {(activeModule === 'dashboard' && (role === 'admin' || role === 'tecnico')) ? (
                <div className={styles.mainContent}>
                  <div className={styles.welcomeSection}>
                    <h1 className={styles.welcomeTitle}>¡Bienvenido, {displayName}!</h1>
                    <p className={styles.welcomeDate}>Resumen del sistema - {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <Dashboard onNavigateModule={setActiveModule} />
                </div>
              ) :
                activeModule === 'profile' ? (
                  <div className={styles.mainContent}>
                    <UserProfile />
                  </div>
                ) :
                activeModule === 'users' ? (
                  <div className={styles.mainContent}>
                    <UsersTable />
                  </div>
                ) :
                activeModule === 'equipment' ? (
                  <div className={styles.mainContent}>
                    <EquipmentTable />
                  </div>
                ) :
                activeModule === 'tickets' ? (
                  <div className={styles.mainContent}>
                    <TicketList />
                  </div>
                ) :
                activeModule === 'reports' ? (
                  <div className={styles.mainContent}>
                    <ReportForm />
                  </div>
                ) :
                activeModule === 'perms' ? (
                  <div className={styles.mainContent}>
                    <PermissionsManager onNavigate={(m) => setActiveModule(m as any)} />
                  </div>
                ) :
                activeModule === 'settings' ? (
                  <div className={styles.mainContent}>
                    <Settings />
                  </div>
                ) :
                <div className={styles.mainContent}>
                  {children}
                </div>
              }
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
