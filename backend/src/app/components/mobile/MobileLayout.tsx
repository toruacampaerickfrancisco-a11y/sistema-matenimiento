"use client";

import { useState, useEffect } from 'react';
import MobileBottomNav from './MobileBottomNav';
import UsersCardList from './UsersCardList';
import EquipmentCardList from './EquipmentCardList';
import TicketCardList from './TicketCardList';
import UserProfile from '../UserProfile';
import PermissionsManager from '../PermissionsManager';
import EditUserModal from '../EditUserModal';
import EditEquipmentModal from '../EditEquipmentModal';
import TicketDetails from '../TicketDetails';
import AddUserModal from '../AddUserModal';
import AddEquipmentModal from '../AddEquipmentModal';
import Dashboard from '../Dashboard';
import ReportForm from '../ReportForm';
import styles from './MobileLayout.module.css';

interface MobileLayoutProps {
  currentUser: any;
  onBackToDashboard?: () => void;
}

export default function MobileLayout({ currentUser, onBackToDashboard }: MobileLayoutProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);
  
  // Estados para datos
  const [users, setUsers] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para modales
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editingEquipment, setEditingEquipment] = useState<any | null>(null);
  const [viewingTicket, setViewingTicket] = useState<any | null>(null);
  const [addingUser, setAddingUser] = useState(false);
  const [addingEquipment, setAddingEquipment] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      console.log('🚀 Loading data due to mobile/tab change');
      loadData();
    }
  }, [isMobile, activeTab]);

  // Cargar datos iniciales cuando el componente se monta
  useEffect(() => {
    if (currentUser && isMobile) {
      console.log('👤 User detected, loading initial data');
      loadData();
    }
  }, [currentUser, isMobile]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    console.log(`🔄 Cargando datos para pestaña: ${activeTab}`);
    
    try {
      switch (activeTab) {
        case 'dashboard':
          // No necesita cargar datos específicos
          break;
        case 'reports':
          // No necesita cargar datos específicos
          break;
        case 'usuarios':
          console.log('📡 Fetching users...');
          const usersRes = await fetch('/api/users');
          if (usersRes.ok) {
            const usersData = await usersRes.json();
            console.log('📊 Users data received:', usersData);
            console.log('📊 Users array:', usersData.users);
            setUsers(Array.isArray(usersData.users) ? usersData.users : []);
          } else {
            console.error('❌ Users API error:', usersRes.status);
            setUsers([]);
          }
          break;
        case 'equipos':
          console.log('📡 Fetching equipment...');
          const equipRes = await fetch('/api/equipment');
          if (equipRes.ok) {
            const equipData = await equipRes.json();
            console.log('📊 Equipment data received:', equipData);
            console.log('📊 Equipment array:', equipData.equipment);
            setEquipment(Array.isArray(equipData.equipment) ? equipData.equipment : []);
          } else {
            console.error('❌ Equipment API error:', equipRes.status);
            setEquipment([]);
          }
          break;
        case 'tickets':
          console.log('📡 Fetching tickets...');  
          console.log('👤 Current user role:', currentUser?.role);
          console.log('👤 Current user ID:', currentUser?.id);
          // Para usuarios normales, solo mostrar sus propios tickets
          const ticketsUrl = currentUser?.role === 'user' ? `/api/tickets?userId=${currentUser.id}` : '/api/tickets';
          console.log('🔗 Tickets URL:', ticketsUrl);
          const ticketsRes = await fetch(ticketsUrl);
          if (ticketsRes.ok) {
            const ticketsData = await ticketsRes.json();
            console.log('📊 Tickets data received:', ticketsData);
            console.log('📊 Tickets array:', ticketsData.tickets);
            setTickets(Array.isArray(ticketsData.tickets) ? ticketsData.tickets : []);
          } else {
            console.error('❌ Tickets API error:', ticketsRes.status);
            setTickets([]);
          }
          break;
      }
    } catch (error: any) {
      console.error('💥 Error loading data:', error);
      setError(`Error cargando ${activeTab}: ${error?.message || 'Error desconocido'}`);
      // Asegurar que los arrays estén inicializados incluso en caso de error
      setUsers([]);
      setEquipment([]);
      setTickets([]);
    } finally {
      setLoading(false);
      console.log(`✅ Finished loading data for ${activeTab}`);
    }
  };

  // Funciones de manejo para modales
  const handleUserSaved = (updatedUser: any) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
    setEditingUser(null);
  };

  const handleEquipmentSaved = (updatedEquipment: any) => {
    setEquipment(prev => prev.map(e => e.id === updatedEquipment.id ? { ...e, ...updatedEquipment } : e));
    setEditingEquipment(null);
  };

  const handleUserCreated = (newUser: any) => {
    setUsers(prev => [newUser, ...prev]);
    setAddingUser(false);
  };

  const handleEquipmentCreated = (newEquipment: any) => {
    setEquipment(prev => [newEquipment, ...prev]);
    setAddingEquipment(false);
  };

  // No mostrar en desktop
  if (!isMobile) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className={styles.tabContent}>
            <div className={styles.header}>
              <h2>🏠 Dashboard</h2>
              <p>Panel principal del sistema</p>
            </div>
            <Dashboard onNavigateModule={setActiveTab} />
          </div>
        );

      case 'reports':
        return (
          <div className={styles.tabContent}>
            <div className={styles.header}>
              <h2>📊 Reportes</h2>
              <p>Crear y gestionar reportes</p>
            </div>
            <ReportForm />
          </div>
        );

      case 'usuarios':
        return (
          <div className={styles.tabContent}>
            <div className={styles.header}>
              <h2>👤 Usuarios</h2>
              <p>Gestión de usuarios del sistema</p>
              {loading && <small>🔄 Cargando usuarios...</small>}
              {error && <small style={{color: 'red'}}>❌ {error}</small>}
              {!loading && !error && <small>📊 {users.length} usuarios encontrados</small>}
            </div>
            <UsersCardList
              users={users}
              loading={loading}
              onEdit={(user) => setEditingUser(user)}
              onDelete={async (userId: string) => {
                if (!confirm('¿Eliminar usuario?')) return;
                try {
                  await fetch(`/api/users/${userId}`, { method: 'DELETE' });
                  setUsers(prev => prev.filter(u => u.id !== userId));
                } catch (err) {
                  alert('Error al eliminar usuario');
                }
              }}
              onAssignEquipment={(userId) => {
                alert(`Funcionalidad de asignar equipo para usuario ${userId} - En desarrollo`);
              }}
            />
            
            {/* Botón flotante para agregar usuario */}
            <button 
              onClick={() => setAddingUser(true)}
              style={{
                position: 'fixed',
                bottom: '100px', // Sobre la navegación inferior
                right: '20px',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7b1343 0%, #a91f4f 50%, #99004d 100%)',
                color: 'white',
                border: 'none',
                fontSize: '24px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(123, 19, 67, 0.4)',
                zIndex: 1000,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              title="Agregar Usuario"
            >
              +
            </button>
          </div>
        );

      case 'equipos':
        return (
          <div className={styles.tabContent}>
            <div className={styles.header}>
              <h2>🖥️ Equipos</h2>
              <p>Inventario y asignación de equipos</p>
              {loading && <small>🔄 Cargando equipos...</small>}
              {error && <small style={{color: 'red'}}>❌ {error}</small>}
              {!loading && !error && <small>📊 {equipment.length} equipos encontrados</small>}
            </div>
            <EquipmentCardList
              equipment={equipment}
              loading={loading}
              onEdit={(equipment) => setEditingEquipment(equipment)}
              onDelete={async (equipId: string) => {
                if (!confirm('¿Eliminar equipo?')) return;
                try {
                  await fetch(`/api/equipment/${equipId}`, { method: 'DELETE' });
                  setEquipment(prev => prev.filter(e => e.id !== equipId));
                } catch (err) {
                  alert('Error al eliminar equipo');
                }
              }}
              onAssignUser={(equipId) => {
                alert(`Funcionalidad de asignar usuario para equipo ${equipId} - En desarrollo`);
              }}
            />
            
            {/* Botón flotante para agregar equipo */}
            <button
              onClick={() => setAddingEquipment(true)}
              style={{
                position: 'fixed',
                bottom: '100px',
                right: '20px',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7b1343, #a91f4f, #99004d)',
                color: 'white',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(123, 19, 67, 0.3)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(123, 19, 67, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(123, 19, 67, 0.3)';
              }}
              title="Agregar Equipo"
            >
              ⚙️+
            </button>
          </div>
        );

      case 'tickets':
        return (
          <div className={styles.tabContent}>
            <div className={styles.header}>
              <h2>📋 Tickets</h2>
              <p>Solicitudes y órdenes de trabajo</p>
              {loading && <small>🔄 Cargando tickets...</small>}
              {error && <small style={{color: 'red'}}>❌ {error}</small>}
              {!loading && !error && <small>📊 {tickets.length} tickets encontrados</small>}
            </div>
            <TicketCardList
              tickets={tickets}
              loading={loading}
              onEdit={(ticket) => setViewingTicket(ticket)}
              onDelete={async (ticketId: string) => {
                if (!confirm('¿Eliminar ticket?')) return;
                try {
                  await fetch(`/api/tickets/${encodeURIComponent(ticketId)}`, { method: 'DELETE' });
                  setTickets(prev => prev.filter(t => t.id !== ticketId));
                } catch (err) {
                  alert('Error al eliminar ticket');
                }
              }}
              onChangeStatus={async (ticketId: string, newStatus: string) => {
                try {
                  console.log('🔄 Cambiando estado del ticket:', ticketId, 'a:', newStatus);
                  // Codificar el ID para que funcione con barras diagonales
                  const encodedTicketId = encodeURIComponent(ticketId);
                  console.log('🔗 Encoded ticket ID:', encodedTicketId);
                  
                  const response = await fetch(`/api/tickets/${encodedTicketId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                  });
                  
                  console.log('📡 Response status:', response.status);
                  
                  if (!response.ok) {
                    const errorData = await response.json();
                    console.error('❌ Error response:', errorData);
                    alert(`Error al cambiar estado: ${errorData.message || 'Error desconocido'}`);
                    return;
                  }
                  
                  const result = await response.json();
                  console.log('✅ Ticket actualizado:', result);
                  
                  setTickets(prev => prev.map(t => 
                    t.id === ticketId ? { ...t, status: newStatus } : t
                  ));
                  
                  alert('Estado cambiado correctamente');
                } catch (err) {
                  console.error('💥 Error general:', err);
                  alert(`Error al cambiar estado: ${err}`);
                }
              }}
            />
          </div>
        );

      case 'permisos':
        return (
          <div className={styles.tabContent}>
            <div className={styles.header}>
              <h2>⚙️ Permisos</h2>
              <p>Gestión de roles y permisos</p>
            </div>
            <div className={styles.permissionsContainer}>
              <PermissionsManager />
            </div>
          </div>
        );

      case 'perfil':
        return (
          <div className={styles.tabContent}>
            <div className={styles.header}>
              <h2>�‍💼 Mi Perfil</h2>
              <p>Información personal y configuración</p>
            </div>
            <div className={styles.profileContainer}>
              <UserProfile />
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
          </div>
        );
    }
  };

  return (
    <div className={styles.mobileLayout}>
      {/* Banner superior */}
      <div className={styles.topBanner}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerLeft}>
            <button 
              className={styles.backButton}
              onClick={onBackToDashboard || (() => window.history.back())}
              title="Ir al Dashboard"
            >
              ← Dashboard
            </button>
          </div>
          <div className={styles.bannerCenter}>
            <span className={styles.bannerTitle}>🏛️ Gobierno de Sonora</span>
          </div>
          <div className={styles.bannerRight}>
            <button 
              className={styles.logoutButton}
              onClick={() => {
                if (confirm('¿Cerrar sesión?')) {
                  localStorage.clear();
                  window.location.href = '/';
                }
              }}
              title="Cerrar sesión"
            >
              🚪
            </button>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {renderContent()}
      </div>
      
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userRole={currentUser?.role || 'user'}
      />

      {/* Modales */}
      {editingUser && (
        <EditUserModal 
          user={editingUser} 
          onClose={() => setEditingUser(null)} 
          onSaved={handleUserSaved} 
        />
      )}
      
      {editingEquipment && (
        <EditEquipmentModal 
          item={editingEquipment} 
          onClose={() => setEditingEquipment(null)} 
          onSaved={handleEquipmentSaved} 
        />
      )}
      
      {viewingTicket && (
        <TicketDetails 
          ticket={viewingTicket} 
          onClose={() => setViewingTicket(null)} 
          onSaved={() => {}}
        />
      )}

      {addingUser && (
        <AddUserModal 
          onClose={() => setAddingUser(false)} 
          onCreated={handleUserCreated} 
        />
      )}

      {addingEquipment && (
        <AddEquipmentModal 
          onClose={() => setAddingEquipment(false)} 
          onCreated={handleEquipmentCreated} 
        />
      )}
    </div>
  );
}