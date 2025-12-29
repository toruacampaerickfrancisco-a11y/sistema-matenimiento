"use client";

import { useState } from 'react';
import styles from './Modal.module.css';

export default function AddUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: (u: any) => void }) {
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = { name, email, department, role, password };
      if (userId.trim()) payload.id = userId.trim();
      const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Error creating');
      const d = await res.json();
      const created = d.user || d;
      // set default per-user permission override so 'reports' menu is available
      try {
        const raw = localStorage.getItem('userPermissions');
        const up = raw ? JSON.parse(raw) : {};
        up[created.id] = { ...(up[created.id] || {}), reports: true };
        localStorage.setItem('userPermissions', JSON.stringify(up));
      } catch (_) {}
      onCreated(created);
      onClose();
    } catch (err) {
      alert('No se pudo crear el usuario.');
    } finally { setLoading(false); }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} style={{ maxWidth: '500px' }}>
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
              👤
            </div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              Agregar Usuario
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
            Complete todos los campos para crear un nuevo usuario
          </p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                placeholder="ID de usuario (opcional)"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
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
                placeholder="Nombre completo"
                value={name} 
                onChange={(e) => setName(e.target.value)}
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
                type="email"
                placeholder="Correo electrónico"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Departamento"
                value={department} 
                onChange={(e) => setDepartment(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = '#8b2635'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div>
              <div style={{ position: 'relative' }}>
                <input 
                  className={styles.input}
                  style={{
                    width: '100%',
                    padding: '12px 80px 12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#fff'
                  }}
                  type="password"
                  placeholder="Contraseña inicial"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  onFocus={(e) => e.target.style.borderColor = '#8b2635'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <button 
                  type="button" 
                  style={{ 
                    position: 'absolute', 
                    right: '8px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    background: '#8b2635',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  🎲 Auto
                </button>
              </div>
              <p style={{ 
                fontSize: '12px', 
                color: '#64748b', 
                margin: '6px 0 0 0',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                ⚡ La contraseña debe tener al menos 6 caracteres
              </p>
            </div>

            <div>
              <select 
                className={styles.select}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#fff',
                  cursor: 'pointer'
                }}
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = '#8b2635'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              >
                <option value="user">Usuario</option>
                <option value="tecnico">Técnico</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              marginTop: '8px',
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
                  background: loading ? '#94a3b8' : '#22c55e',
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
                {loading ? '⏳ Creando...' : '✅ Crear Usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
