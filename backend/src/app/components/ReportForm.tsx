"use client";

import React, { useEffect, useState } from 'react';
import styles from './expediente.module.css';
import modalStyles from './Modal.module.css';

type User = {
  id: string;
  [key: string]: any;
};

type Equipment = {
  id: string;
  type: string;
  brand?: string;
  model?: string;
  [key: string]: any;
};

export default function ReportForm() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userEquipment, setUserEquipment] = useState<Equipment[]>([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [serviceCatalog, setServiceCatalog] = useState<{ nombre: string; tipo: string }[]>([]);
  const [selectedCatalogService, setSelectedCatalogService] = useState('');
  const [observations, setObservations] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  // Cargar catálogo de servicios comunes
  useEffect(() => {
    fetch('/catalogo_servicios.json')
      .then(res => res.json())
      .then(data => setServiceCatalog(data))
      .catch(() => setServiceCatalog([]));
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) {
        const u = JSON.parse(raw);
        setUser(u);
        // default selected user to current user if available
        if (u?.id) setSelectedUserId(u.id);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    // load all users so admin/tecnico can pick someone
    fetch('/api/users')
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d) ? d : d?.users || [];
        setUsers(list);
        // if no selectedUserId yet, try to default to current user or first user
        if (!selectedUserId) {
          const cur = list.find((x: any) => x.id === user?.id);
          if (cur) setSelectedUserId(cur.id);
          else if (list.length) setSelectedUserId(list[0].id);
        }
      })
      .catch(() => {
        // ignore, we'll still allow current user
      });
  }, [user, selectedUserId]);

  useEffect(() => {
    // when selected user changes, load their equipment
    if (!selectedUserId) {
      setUserEquipment([]);
      setSelectedEquipmentId('');
      return;
    }

    fetch('/api/equipment')
      .then(res => res.json())
      .then(data => {
        const allEquipment = data.equipment || data.items || [];
        // Debug: log all equipment and selected user
        console.log('[DEBUG] Equipos recibidos:', allEquipment);
        console.log('[DEBUG] Usuario seleccionado:', selectedUserId);
        const equipmentForUser = allEquipment.filter((eq: Equipment) => {
          const eqUserId = eq.user_id ?? eq.userId ?? eq.assignedTo ?? '';
          return String(eqUserId) === String(selectedUserId);
        });
        console.log('[DEBUG] Equipos asignados al usuario:', equipmentForUser);
        setUserEquipment(equipmentForUser);
        // Si el equipo seleccionado sigue disponible, no lo cambies
        if (equipmentForUser.length > 0) {
          const stillExists = equipmentForUser.some((eq: Equipment) => eq.id === selectedEquipmentId);
          setSelectedEquipmentId(stillExists ? selectedEquipmentId : equipmentForUser[0].id);
        } else {
          setSelectedEquipmentId('');
        }
      })
      .catch(() => {
        setMessage({ type: 'error', text: 'No se pudo cargar la lista de equipos.' });
      });
  }, [selectedUserId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUserId || !selectedEquipmentId || !serviceType || !observations) {
      setMessage({ type: 'error', text: 'Por favor, complete todos los campos.' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUserId || user?.id,
          equipmentId: selectedEquipmentId,
          serviceType,
          observations,
        }),
      });

      if (!res.ok) throw new Error('Error al crear el ticket.');

      const ticketResponse = await res.json();
      const createdTicket = ticketResponse.ticket || ticketResponse;

      // 🔔 Enviar notificaciones a administradores y técnicos
      try {
        const selectedUser = users.find(u => u.id === selectedUserId);
        const { notifyNewTicket } = await import('../../lib/notifications');
        
        await notifyNewTicket({
          id: createdTicket.id || 'nuevo',
          userId: selectedUserId || user?.id || '',
          userName: selectedUser?.name || selectedUser?.email || 'Usuario',
          equipmentId: selectedEquipmentId,
          serviceType,
          observations
        });
        
        console.log('✅ Notificaciones enviadas a administradores y técnicos');
      } catch (notificationError) {
        console.error('⚠️ Error al enviar notificaciones:', notificationError);
        // No interrumpir el flujo si fallan las notificaciones
      }

      setMessage({ type: 'success', text: 'Reporte enviado exitosamente. Los técnicos han sido notificados.' });
      setServiceType('');
      setObservations('');
    } catch (err) {
      setMessage({ type: 'error', text: 'Ocurrió un error al enviar el reporte.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <div className={modalStyles.modal} style={{ position: 'relative', margin: '0', maxWidth: '100%', width: '100%' }}>
        <div className={modalStyles.header}>
          <h2 className={modalStyles.title}>
            📋 Crear Reporte de Mantenimiento
          </h2>
        </div>
        
        <div className={modalStyles.content}>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>
            Complete la información para generar un nuevo reporte de mantenimiento
          </p>
          
          <form onSubmit={handleSubmit} className={modalStyles.form}>
            {user && user.role === 'user' ? (
              <div className={modalStyles.formGroup}>
                <label className={modalStyles.label}>👤 Usuario Solicitante</label>
                <input 
                  type="text" 
                  value={user.name || user.email || user.id} 
                  disabled 
                  className={modalStyles.input}
                  style={{ backgroundColor: '#f8fafc', color: '#475569' }}
                />
                <p className={modalStyles.helpText}>
                  ℹ️ Este reporte se generará automáticamente para su usuario
                </p>
              </div>
            ) : (
              <div className={modalStyles.formGroup}>
                <label className={modalStyles.label}>👤 Seleccionar Usuario</label>
                <select 
                  value={selectedUserId} 
                  onChange={e => setSelectedUserId((e.target as HTMLSelectElement).value)} 
                  required 
                  className={modalStyles.select}
                >
                  <option value="">-- Seleccione un usuario --</option>
                  {users.length === 0 && <option disabled>Cargando usuarios...</option>}
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name || u.email || u.id}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedUserId && (
              <div style={{ 
                background: 'transparent', 
                border: '2px solid rgba(59, 130, 246, 0.4)', 
                borderRadius: '8px', 
                padding: '12px',
                marginBottom: '16px',
                backdropFilter: 'blur(2px)'
              }}>
                {(() => {
                  const su = users.find(x => String(x.id) === String(selectedUserId));
                  if (!su) return null;
                  return (
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#1e40af',
                      textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
                    }}>
                      ✅ <strong>Usuario seleccionado:</strong> {su.name || su.email || su.id}
                      {su.email && <span style={{ marginLeft: '8px', color: '#475569' }}>({su.email})</span>}
                    </div>
                  );
                })()}
              </div>
            )}

            <div className={modalStyles.formGroup}>
              <label className={modalStyles.label}>🖥️ Equipo a Reportar</label>
              <select 
                value={selectedEquipmentId} 
                onChange={e => setSelectedEquipmentId(e.target.value)} 
                required 
                className={modalStyles.select}
              >
                <option value="">-- Seleccione un equipo --</option>
                {userEquipment.length === 0 && selectedUserId && (
                  <option disabled>No hay equipos asignados a este usuario</option>
                )}
                {userEquipment.map(eq => (
                  <option key={eq.id} value={eq.id}>
                    {eq.type} - {eq.brand} {eq.model} (ID: {eq.id})
                  </option>
                ))}
              </select>
              {userEquipment.length === 0 && selectedUserId && (
                <p className={modalStyles.warningText}>
                  ⚠️ Este usuario no tiene equipos asignados
                </p>
              )}
            </div>

            <div className={modalStyles.formGroup}>
              <label className={modalStyles.label}>🔧 Servicio Predefinido (Opcional)</label>
              <select
                value={selectedCatalogService}
                onChange={e => {
                  const idx = e.target.selectedIndex;
                  setSelectedCatalogService(e.target.value);
                  if (idx > 0 && serviceCatalog[idx - 1]) {
                    setServiceType(serviceCatalog[idx - 1].tipo);
                  } else {
                    setServiceType('');
                  }
                }}
                className={modalStyles.select}
              >
                <option value="">-- Seleccionar servicio común --</option>
                {serviceCatalog.map((svc, i) => (
                  <option key={i} value={svc.nombre}>
                    {svc.nombre} ({svc.tipo})
                  </option>
                ))}
              </select>
              <p className={modalStyles.helpText}>
                💡 Seleccione un servicio común para autocompletar el tipo
              </p>
            </div>

            <div className={modalStyles.formGroup}>
              <label className={modalStyles.label}>📝 Tipo de Servicio</label>
              <input 
                value={serviceType} 
                onChange={e => setServiceType(e.target.value)} 
                placeholder="Ej: Preventivo, Correctivo, Instalación, Configuración..."
                required 
                className={modalStyles.input}
              />
            </div>

            <div className={modalStyles.formGroup}>
              <label className={modalStyles.label}>📄 Descripción del Problema</label>
              <textarea 
                value={observations} 
                onChange={e => setObservations(e.target.value)} 
                rows={5} 
                placeholder="Describa detalladamente la falla que presenta el equipo, síntomas observados, y cualquier información relevante para el técnico..."
                required 
                className={modalStyles.textarea}
              />
              <p className={modalStyles.helpText}>
                ℹ️ Proporcione la mayor cantidad de detalles posible para facilitar el diagnóstico
              </p>
            </div>

            {message.text && (
              <div style={{ 
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                background: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
                border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
                color: message.type === 'error' ? '#dc2626' : '#166534'
              }}>
                {message.type === 'error' ? '❌' : '✅'} {message.text}
              </div>
            )}

            <div className={modalStyles.actions}>
              <button 
                type="submit" 
                className={`${modalStyles.button} ${modalStyles.buttonPrimary}`}
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? '⏳ Enviando reporte...' : '📨 Enviar Reporte de Mantenimiento'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}