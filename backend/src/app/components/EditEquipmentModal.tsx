"use client";

import { useEffect, useMemo, useState } from 'react';
import styles from './Modal.module.css';

export default function EditEquipmentModal({ item, onClose, onSaved }: { item: any; onClose: () => void; onSaved: (u: any) => void }) {
  const [type, setType] = useState(item?.type || '');
  const [brand, setBrand] = useState(item?.brand || '');
  const [model, setModel] = useState(item?.model || '');
  const [serial, setSerial] = useState(item?.serial || '');
  const [activoFijo, setActivoFijo] = useState(item?.activo_fijo || '');
  const [userId, setUserId] = useState(item?.userId || item?.user_id || '');
  const [users, setUsers] = useState<any[]>([]);
  const [userQuery, setUserQuery] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/equipment/${encodeURIComponent(item.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, brand, model, serial, activo_fijo: activoFijo, userId }),
      });
      if (!res.ok) throw new Error('Error');
      const d = await res.json();
      onSaved(d.equipment || d);
      onClose();
    } catch (err) {
      alert('No se pudo actualizar el equipo.');
    } finally { setLoading(false); }
  }

  useEffect(() => {
    setLoadingUsers(true);
    fetch('/api/users')
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d) ? d : d?.users || [];
        setUsers(list);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoadingUsers(false));
  }, []);

  const filteredUsers = useMemo(() => {
    const q = String(userQuery || '').trim().toLowerCase();
    if (!q) return users;
    return users.filter((u: any) => (String(u.name || '') + ' ' + String(u.email || '') + ' ' + String(u.id || '')).toLowerCase().includes(q));
  }, [users, userQuery]);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} style={{ width: '600px', maxWidth: '95vw' }}>
        <div className={styles.header} style={{ 
          borderBottom: 'none', 
          paddingBottom: '10px',
          background: 'linear-gradient(135deg, #8b2635 0%, #a91b60 100%)',
          color: 'white',
          borderRadius: '16px 16px 0 0',
          margin: '-24px -24px 20px -24px',
          padding: '20px 24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              borderRadius: '8px', 
              padding: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              🛠️
            </div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              Editar Equipo
            </h2>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              border: 'none', 
              color: 'white', 
              borderRadius: '6px', 
              padding: '6px 8px', 
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cerrar
          </button>
        </div>
        
        <div className={styles.content}>
          <p style={{ 
            color: '#64748b', 
            marginBottom: '24px', 
            fontSize: '14px',
            textAlign: 'center'
          }}>
            Modifique la información técnica del equipo y reasígnelo si es necesario
          </p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <input 
                  className={styles.input}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#fff'
                  }}
                  placeholder="Tipo de Equipo"
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  required
                  onFocus={(e) => e.target.style.borderColor = '#8b2635'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div>
                <input 
                  className={styles.input}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#fff'
                  }}
                  placeholder="Marca"
                  value={brand} 
                  onChange={(e) => setBrand(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = '#8b2635'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <input 
                  className={styles.input}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#fff'
                  }}
                  placeholder="Modelo"
                  value={model} 
                  onChange={(e) => setModel(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = '#8b2635'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div>
                <input 
                  className={styles.input}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#fff'
                  }}
                  placeholder="Número de serie (opcional)"
                  value={serial} 
                  onChange={(e) => setSerial(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = '#8b2635'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <p style={{ 
                  fontSize: '12px', 
                  color: '#64748b', 
                  margin: '6px 0 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  🏷️ Número de serie del equipo
                </p>
              </div>
            </div>

            <div>
              <input 
                className={styles.input}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#fff',
                  fontFamily: 'monospace',
                  fontWeight: '600'
                }}
                placeholder="AF-2025-0000 (opcional)"
                value={activoFijo} 
                onChange={(e) => setActivoFijo(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = '#8b2635'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <p style={{ 
                fontSize: '12px', 
                color: '#64748b', 
                margin: '6px 0 0 0',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                🏛️ Código de activo fijo institucional
              </p>
            </div>

            {/* Sección de Reasignación de Usuario */}
            <div style={{ 
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
              border: '2px solid #e2e8f0', 
              borderRadius: '12px', 
              padding: '20px',
              marginTop: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <span style={{ fontSize: '18px' }}>🔄</span>
                <h4 style={{ 
                  margin: 0, 
                  color: '#475569',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Reasignación de Usuario
                </h4>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <input 
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#fff'
                  }}
                  placeholder="🔍 Buscar usuario..."
                  value={userQuery} 
                  onChange={(e) => setUserQuery(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = '#8b2635'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <p style={{ 
                  fontSize: '12px', 
                  color: '#64748b', 
                  margin: '6px 0 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  💡 Escriba para filtrar usuarios
                </p>
              </div>
              
              <div>
                <select 
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    minHeight: '48px'
                  }}
                  value={userId} 
                  onChange={(e) => setUserId(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = '#8b2635'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                  <option value="">-- Equipo sin asignar --</option>
                  {filteredUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      👤 {u.name || u.email || u.id} {u.email ? `(${u.email})` : ''}
                    </option>
                  ))}
                </select>

                {loadingUsers && (
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#64748b', 
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    ⏳ Cargando usuarios...
                  </div>
                )}

                {(userQuery || userId) && (
                  <button 
                    type="button" 
                    onClick={() => { setUserQuery(''); setUserId(''); }}
                    style={{ 
                      background: '#f87171',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      marginTop: '8px'
                    }}
                  >
                    🗑️ Limpiar
                  </button>
                )}
              </div>

              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '6px',
                padding: '8px 12px',
                marginTop: '12px',
                fontSize: '12px',
                color: '#1e40af'
              }}>
                ℹ️ <strong>Nota:</strong> Puede dejar el equipo sin asignar o reasignarlo a otro usuario
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              marginTop: '24px',
              justifyContent: 'flex-end'
            }}>
              <button 
                type="button" 
                onClick={onClose} 
                disabled={loading}
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={loading}
                style={{
                  background: loading ? '#94a3b8' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {loading ? '⏳ Actualizando...' : '💾 Actualizar Equipo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
