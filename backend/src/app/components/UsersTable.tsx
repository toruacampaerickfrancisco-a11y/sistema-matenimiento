"use client";

import { useEffect, useMemo, useState, useRef } from 'react';
import EditUserModal from './EditUserModal';
import AddUserModal from './AddUserModal';
import ActionButtons from './ActionButtons';
import Pagination from './Pagination';
import styles from './Table.module.css';
import { usePreciseUpdates } from './hooks/usePreciseUpdates';
import { useColumnAutoSize, ColumnConfig } from './hooks/useColumnAutoSize';

export default function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rawResp, setRawResp] = useState<any>(null);
  const [q, setQ] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  
  // 📄 Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 🚀 Referencia para el contenedor de la tabla
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // 🚀 Configuración de columnas para autoajuste (memoized)
  const columnConfig: ColumnConfig[] = useMemo(() => [
    {
      key: 'name',
      label: 'Nombre',
      priority: 'high',
      minWidth: 150,
      maxWidth: 300,
      preferredWidth: 200,
      flexible: true,
      breakpoint: 'mobile'
    },
    {
      key: 'email',
      label: 'Email',
      priority: 'high',
      minWidth: 180,
      maxWidth: 350,
      preferredWidth: 250,
      flexible: true,
      breakpoint: 'tablet'
    },
    {
      key: 'department',
      label: 'Departamento',
      priority: 'medium',
      minWidth: 120,
      maxWidth: 250,
      preferredWidth: 180,
      flexible: true,
      breakpoint: 'tablet'
    },
    {
      key: 'role',
      label: 'Rol',
      priority: 'medium',
      minWidth: 80,
      maxWidth: 150,
      preferredWidth: 100,
      flexible: true,
      breakpoint: 'tablet'
    },
    {
      key: 'acciones',
      label: 'Acciones',
      priority: 'low',
      minWidth: 100,
      maxWidth: 150,
      preferredWidth: 120,
      flexible: false,
      breakpoint: 'desktop'
    }
  ], []);
  // 🚀 Hook de autoajuste de columnas
  const { tableDimensions, getColumnClass, debug } = useColumnAutoSize(
    columnConfig,
    tableContainerRef,
    {
      minTableWidth: 800,
      maxTableWidth: 1400,
      padding: 40,
      enableHiding: true
    }
  );

  // 💡 Función para determinar si un usuario está conectado
  const isUserOnline = (userId: string) => {
    // El usuario actual siempre está conectado
    if (userId === currentUser?.id) return true;
    
    // Simulación de usuarios conectados basada en hash del ID
    // En producción esto vendría de la base de datos o sistema de sesiones
    const now = Date.now();
    const userHash = userId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const minutes = Math.floor(now / 60000); // Cambia cada minuto
    return (userHash + minutes) % 4 === 0; // ~25% usuarios "conectados"
  };

  // Obtener usuario actual
  useEffect(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) setCurrentUser(JSON.parse(raw));
    } catch (_) {}
  }, []);

  // 🔄 Actualización automática de estados de conexión cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      // Forzar re-render para actualizar estados de conexión
      setOnlineUsers(prev => new Set([...prev]));
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  // 🎯 Sistema de actualización por eventos precisos - SOLO cuando se modifiquen usuarios
  const { data: usersData, forceUpdate: forceUserUpdate, triggerEvent } = usePreciseUpdates({
    endpoint: '/api/users',
    eventTypes: ['user-created', 'user-updated', 'user-deleted'], // Solo eventos de usuarios
    enabled: !!currentUser,
    onUpdate: (data: any) => {
      const newUsers = data.users || [];
      setRawResp(data);
      setUsers(newUsers);
    },
    dependencies: [q, departmentFilter],
    cacheKey: `users-${q}-${departmentFilter}`
  });

  const isConnected = false; // Sin conexiones automáticas

  // Función para cargar usuarios con loading visible
  const loadUsers = async () => {
    setLoading(true);
    await loadUsersData();
    setLoading(false);
  };

  // Función para cargar usuarios silenciosamente
  const loadUsersSilently = async () => {
    await loadUsersData();
  };

  // Función base para cargar datos de usuarios
  const loadUsersData = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      
      // Solo actualizar si hay cambios reales
      const newUsers = data.users || [];
      const hasChanges = JSON.stringify(newUsers) !== JSON.stringify(users);
      
      if (hasChanges) {
        // Actualización completamente silenciosa
        setRawResp(data);
        setUsers(newUsers);
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  // Cargar usuarios inicial
  useEffect(() => {
    loadUsers();
  }, []);

  const deptOptions = useMemo(() => {
    const set = new Set<string>();
    users.forEach((u) => {
      if (u && u.department) set.add(String(u.department));
    });
    return Array.from(set).sort();
  }, [users]);

  const filtered = useMemo(() => {
    let list = users;
    const term = q?.trim().toLowerCase();
    if (term) {
      list = list.filter((u) => {
        if (!u) return false;
        const id = String(u.id || '').toLowerCase();
        const name = String(u.name || '').toLowerCase();
        const email = String(u.email || '').toLowerCase();
        const role = String(u.role || '').toLowerCase();
        const dept = String(u.department || '').toLowerCase();
        return id.includes(term) || name.includes(term) || email.includes(term) || role.includes(term) || dept.includes(term);
      });
    }
    if (departmentFilter) {
      list = list.filter((u) => String(u.department || '') === departmentFilter);
    }
    if (roleFilter) {
      list = list.filter((u) => String(u.role || '') === roleFilter);
    }
    return list;
  }, [users, q, departmentFilter, roleFilter]);

  // 📄 Paginación calculada
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filtered.slice(startIndex, endIndex);

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [q, departmentFilter, roleFilter]);

  async function handleDeleteUser(id: string) {
    if (!confirm('\u00bfEliminar este usuario? Esta acci\u00f3n no se puede deshacer.')) return;
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error eliminando');
      setUsers((s) => s.filter((u) => u.id !== id));
      
      // 🔥 Disparar evento de usuario eliminado
      triggerEvent('user-deleted', { userId: id });
    } catch (err) {
      alert('No se pudo eliminar el usuario.');
    }
  }

  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [addingUser, setAddingUser] = useState(false);

  function handleUserSaved(u: any) {
    setUsers((s) => s.map((x) => (x.id === u.id ? { ...(x), ...(u || {}) } : x)));
    
    // 🔥 Disparar evento de usuario actualizado
    triggerEvent('user-updated', { user: u });
  }

  function handleUserCreated(u: any) {
    setUsers((s) => [u, ...s]);
    
    // 🔥 Disparar evento de usuario creado
    triggerEvent('user-created', { user: u });
  }

  if (loading) return <div>Cargando usuarios...</div>;

  if (!users.length) return (
    <div>
      <div>No hay usuarios.</div>
      <details style={{ marginTop: 12 }}>
        <summary>Ver respuesta cruda de /api/users</summary>
        <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(rawResp, null, 2)}</pre>
      </details>
    </div>
  );

  return (
    <div style={{ 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 20px'
    }}>
      {/* Primera fila: Filtros - Exacto como en las imágenes */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-end', 
        gap: 20, 
        marginBottom: 16,
        width: '100%'
      }}>
        {/* Filtros de la izquierda - exacto como la imagen */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '11px', 
              fontWeight: '500', 
              color: '#9ca3af', 
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              DEPARTAMENTO
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter((e.target as HTMLSelectElement).value)}
              style={{
                width: '260px',
                height: '42px',
                padding: '0 16px 0 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: '#4b5563',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                backgroundPosition: 'right 12px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '16px'
              }}
            >
              <option value="">Todos los Departamentos</option>
              {deptOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '11px', 
              fontWeight: '500', 
              color: '#9ca3af', 
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              ROL DE USUARIO
            </label>
            <select
              value={roleFilter || ''}
              onChange={(e) => setRoleFilter((e.target as HTMLSelectElement).value || '')}
              style={{
                width: '200px',
                height: '42px',
                padding: '0 16px 0 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: '#4b5563',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                backgroundPosition: 'right 12px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '16px'
              }}
            >
              <option value="">Todos los Roles</option>
              <option value="admin">Administrador</option>
              <option value="technician">Técnico</option>
              <option value="user">Usuario</option>
            </select>
          </div>
        </div>

        {/* Barra de búsqueda centrada - exacta como la imagen */}
        <div style={{ 
          flex: 1,
          maxWidth: '420px',
          position: 'relative',
          marginLeft: 'auto',
          marginRight: '24px'
        }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{
              position: 'absolute',
              left: '14px',
              fontSize: '16px',
              color: '#9ca3af',
              zIndex: 1
            }}>
              🔍
            </span>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ((e.target as HTMLInputElement).value)}
              placeholder="Buscar por ID, nombre, email, depto..."
              style={{
                width: '100%',
                height: '42px',
                padding: '0 16px 0 40px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: '#4b5563',
                outline: 'none',
                boxShadow: 'none'
              }}
            />
          </div>
        </div>
        
        {/* Botón de exportar - exacto como la imagen */}
        <button 
          onClick={() => {
            const csvContent = "data:text/csv;charset=utf-8," + 
              "ID,Nombre,Email,Rol,Departamento\n" +
              filtered.map(u => 
                `${u.id},"${u.name}","${u.email}","${u.role}","${u.department}"`
              ).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "usuarios.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          style={{ 
            background: '#10b981', 
            color: 'white', 
            borderRadius: '6px', 
            padding: '0 20px', 
            border: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8,
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            height: '42px',
            whiteSpace: 'nowrap',
            minWidth: 'fit-content',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}
        >
          📋 Exportar
        </button>
      </div>

  <div 
        ref={tableContainerRef}
        className={`${styles.tableWrapper} ${styles.large}`}
      >
        {/* 🚀 Indicador de autoajuste */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          fontSize: '12px',
          color: '#10b981',
          background: 'rgba(16, 185, 129, 0.1)',
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          📊 {debug.visibleColumns}/{debug.totalColumns} cols | {debug.screenCategory} | {debug.tableWidth}px
        </div>
        
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={`${styles.th} ${styles.colName} ${styles.columnResponsive}`} style={getColumnClass('name').style}>
                Nombre
              </th>
              <th className={`${styles.th} ${styles.colEmail} ${styles.columnResponsive}`} style={getColumnClass('email').style}>
                Email
              </th>
              <th className={`${styles.th} ${styles.colDepartment} ${styles.columnResponsive}`} style={getColumnClass('department').style}>
                Departamento
              </th>
              <th className={`${styles.th} ${styles.colRole} ${styles.columnResponsive}`} style={getColumnClass('role').style}>
                Rol
              </th>
              <th className={`${styles.th} ${styles.colActions} ${styles.columnResponsive}`} style={getColumnClass('actions').style}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => (
              <tr key={u.id} className={styles.compactRow}>
                <td 
                  className={`${styles.td} ${styles.colName} ${styles.columnResponsive}`} 
                  style={getColumnClass('name').style}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div>
                      <div>{u.name}</div>
                      <div>ID: {u.id}</div>
                    </div>
                  </div>
                </td>
                <td 
                  className={`${styles.td} ${styles.colEmail} ${styles.columnResponsive}`} 
                  style={getColumnClass('email').style}
                >
                  {u.email}
                </td>
                <td 
                  className={`${styles.td} ${styles.colDepartment} ${styles.columnResponsive}`} 
                  style={getColumnClass('department').style}
                >
                  {u.department || '-'}
                </td>
                <td 
                  className={`${styles.td} ${styles.colRole} ${styles.columnResponsive}`} 
                  style={getColumnClass('role').style}
                >
                  {u.role}
                </td>
                <td 
                  className={`${styles.actionsCell} ${styles.colActions} ${styles.columnResponsive}`}
                  style={getColumnClass('actions').style}
                >
                  <div className="actionButtons">
                    <ActionButtons
                      onView={() => {/* no-op or future view */}}
                        onEdit={() => setEditingUser(u)}
                        onDelete={() => handleDeleteUser(u.id)}
                        size={12}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 📄 Componente de Paginación */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      {/* Botón flotante para agregar usuario */}
      <button 
        onClick={() => setAddingUser(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#249b8a',
          color: 'white',
          border: 'none',
          fontSize: '24px',
          fontWeight: '700',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#1e8873';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = '#249b8a';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="Agregar Usuario"
      >
        +
      </button>

      {editingUser ? <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onSaved={handleUserSaved} /> : null}
      {addingUser ? <AddUserModal onClose={() => setAddingUser(false)} onCreated={handleUserCreated} /> : null}
    </div>
  );
}
