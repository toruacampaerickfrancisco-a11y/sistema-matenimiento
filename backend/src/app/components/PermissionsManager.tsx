"use client";

import React, { useEffect, useState } from 'react';
import styles from './expediente.module.css';

type Permissions = {
  [role: string]: {
    reports?: boolean;
    users?: boolean;
    equipment?: boolean;
    tickets?: boolean;
  };
};

const defaultPermissions: Permissions = {
  admin: { reports: true, users: true, equipment: true, tickets: true },
  tecnico: { reports: true, users: false, equipment: true, tickets: true },
  user: { reports: true, users: false, equipment: false, tickets: false }
};

export default function PermissionsManager({ onNavigate }: { onNavigate?: (m: 'reports' | 'users' | 'equipment' | 'tickets') => void }) {
  const [perms, setPerms] = useState<Permissions>(defaultPermissions);
  const [editedRole, setEditedRole] = useState<string>('tecnico');

  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [query, setQuery] = useState('');

  const [userPermissions, setUserPermissions] = useState<Record<string, Partial<Permissions[string]>>>({});
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<Partial<Permissions[string]>>({});
  const [isRoleSectionOpen, setIsRoleSectionOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    try {
      const raw = localStorage.getItem('appPermissions');
      if (raw) setPerms(JSON.parse(raw));
    } catch (_) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('appPermissions', JSON.stringify(perms));
    } catch (_) {}
  }, [perms]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('userPermissions');
      if (raw) setUserPermissions(JSON.parse(raw));
    } catch (_) { setUserPermissions({}); }
  }, []);

   useEffect(() => {
    setLoadingUsers(true);
    fetch('/api/users')
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.users ?? []);
        if (list.length) {
          const normalized = list.map((x: any) => ({
            id: x.id ?? x._id ?? x.userId ?? x.uid ?? '',
            name: x.name ?? x.nombre ?? x.displayName ?? '',
            email: x.email ?? x.correo ?? '',
            role: x.role ?? x.rol ?? 'user',
            department: x.department ?? x.departamento ?? x.area ?? ''
          }));
          setUsers(normalized);
        }
      })
      .catch(() => {
        // Fallback a usuarios de prueba si la API falla
        setUsers([
          { id: 'user-1001', name: 'Admin', email: 'admin@example.com', role: 'admin', department: 'DESPACHO' },
          { id: 'user-1002', name: 'PABLO IVAN GARCIA', email: 'pablo.ivan.garcia.minjarez@example.com', role: 'user', department: 'SUBSECRETARIA DE INFRAESTRUCTURA SOCIAL' },
          { id: 'user-1003', name: 'FERNANDO RENDON MONTOYA', email: 'fernando.rendon.montoya@example.com', role: 'technician', department: 'DESPACHO' }
        ]);
      })
      .finally(() => setLoadingUsers(false));
  }, []);

  function toggle(role: string, key: keyof Permissions[string]) {
    setPerms((p) => ({ ...p, [role]: { ...(p[role] || {}), [key]: !(p[role] && p[role][key]) } }));
  }

  function startEditUser(userId: string) {
    setEditingUserId(userId);
    setEditingValues(userPermissions[userId] ? { ...userPermissions[userId] } : {});
  }

  function cancelEdit() {
    setEditingUserId(null);
    setEditingValues({});
  }

  function saveUserPermissions(userId: string) {
    const next = { ...userPermissions, [userId]: editingValues };
    setUserPermissions(next);
    try { localStorage.setItem('userPermissions', JSON.stringify(next)); } catch (_) { }
    setEditingUserId(null);
    setEditingValues({});
  }

  function resetUserPermissions(userId: string) {
    const copy = { ...userPermissions };
    delete copy[userId];
    setUserPermissions(copy);
    try { localStorage.setItem('userPermissions', JSON.stringify(copy)); } catch (_) { }
  }

  function toggleEditingValue(key: keyof Permissions[string]) {
    setEditingValues((v) => ({ ...(v || {}), [key]: !(v && v[key]) }));
  }

  function handleNavigate(moduleKey: 'reports' | 'users' | 'equipment' | 'tickets') {
    if (onNavigate) onNavigate(moduleKey);
    else try { localStorage.setItem('navigateToModule', moduleKey); } catch (_) { }
  }

  const filteredUsers = users.filter(u => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return String(u.id || '').toLowerCase().includes(q)
      || String(u.name || '').toLowerCase().includes(q)
      || String(u.email || '').toLowerCase().includes(q)
      || String(u.role || '').toLowerCase().includes(q)
      || String(u.department || '').toLowerCase().includes(q);
  });

  // Lógica de paginación
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <h3>Administrador de permisos</h3>

      <div className={styles.card} style={{ marginBottom: 12 }}>
        <h4 onClick={() => setIsRoleSectionOpen(s => !s)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0 }}>
          <span>Permisos por Rol</span>
          <span style={{ fontSize: '0.8em' }}>{isRoleSectionOpen ? '🔼' : '🔽'}</span>
        </h4>
        {isRoleSectionOpen && (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
              <label>Rol a editar:</label>
              <select value={editedRole} onChange={(e) => setEditedRole(e.target.value)}>
                {Object.keys(perms).map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
              <label><input type="checkbox" checked={!!perms[editedRole]?.reports} onChange={() => toggle(editedRole, 'reports')} /> Mis datos</label>
              <label><input type="checkbox" checked={!!perms[editedRole]?.users} onChange={() => toggle(editedRole, 'users')} /> Usuarios</label>
              <label><input type="checkbox" checked={!!perms[editedRole]?.equipment} onChange={() => toggle(editedRole, 'equipment')} /> Equipos</label>
              <label><input type="checkbox" checked={!!perms[editedRole]?.tickets} onChange={() => toggle(editedRole, 'tickets')} /> Tickets</label>
            </div>
          </div>
        )}
      </div>

      <div>
        <h4>Permisos por Usuario</h4>
        {loadingUsers ? (
          <div className={styles.card}>Cargando usuarios...</div>
        ) : users.length === 0 ? (
          <div className={styles.card}>No se encontraron usuarios.</div>
        ) : (
          <div className={styles.permissionsCard} style={{ fontSize: 15 }}>
            {/* Barra superior exacta como en la imagen */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 24, 
              marginBottom: 20,
              padding: '0',
              background: 'transparent'
            }}>
              {/* Barra de búsqueda - exacta como la imagen */}
              <div style={{ 
                flex: 1,
                maxWidth: '420px',
                position: 'relative'
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
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Buscar por ID, nombre, email, rol, departamento..."
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
            </div>

            <table className={styles.permTable}>
              <thead>
                <tr>
                  <th style={{ width: 240 }}>Nombre</th>
                  <th>Rol</th>
                  <th>Mis datos</th>
                  <th>Usuarios</th>
                  <th>Equipos</th>
                  <th>Tickets</th>
                  <th style={{ width: 280 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((u) => {
                  const r = u.role || 'user';
                  const rolePerms = (perms && perms[r]) ? perms[r] : (defaultPermissions[r] || defaultPermissions['user']);
                  const override = userPermissions[u.id] || {};
                  const eff = {
                    reports: override.reports !== undefined ? override.reports : rolePerms.reports,
                    users: override.users !== undefined ? override.users : rolePerms.users,
                    equipment: override.equipment !== undefined ? override.equipment : rolePerms.equipment,
                    tickets: override.tickets !== undefined ? override.tickets : rolePerms.tickets,
                  };
                  return (
                    <tr key={u.id || u.email}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{u.name || 'Sin nombre'}</div>
                        <div style={{ color: '#9a9a9a', fontSize: 12 }}>ID: {String(u.id || '')}</div>
                      </td>
                      <td>{r}</td>
                      <td>{eff.reports ? '✅' : '❌'}</td>
                      <td>{eff.users ? '✅' : '❌'}</td>
                      <td>{eff.equipment ? '✅' : '❌'}</td>
                      <td>{eff.tickets ? '✅' : '❌'}</td>
                      <td>
                        {editingUserId === u.id ? (
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                            <label><input type="checkbox" checked={editingValues.reports === true} onChange={() => toggleEditingValue('reports')} /> Mis datos</label>
                            <label><input type="checkbox" checked={editingValues.users === true} onChange={() => toggleEditingValue('users')} /> Usuarios</label>
                            <label><input type="checkbox" checked={editingValues.equipment === true} onChange={() => toggleEditingValue('equipment')} /> Equipos</label>
                            <label><input type="checkbox" checked={editingValues.tickets === true} onChange={() => toggleEditingValue('tickets')} /> Tickets</label>
                            <button className={styles.pillBtn} onClick={() => saveUserPermissions(u.id)}>Guardar</button>
                            <button className={`${styles.pillBtn} ${styles.ghost}`} onClick={() => cancelEdit()}>Cancelar</button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <button className={styles.pillBtn} onClick={() => startEditUser(u.id)}>Editar permisos</button>
                            {userPermissions[u.id] ? (
                              <button className={`${styles.pillBtn} ${styles.ghost}`} onClick={() => resetUserPermissions(u.id)}>Reset</button>
                            ) : null}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, padding: '8px 0' }}>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className={styles.pillBtn} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Anterior</button>
                <button className={styles.pillBtn} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Siguiente</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
