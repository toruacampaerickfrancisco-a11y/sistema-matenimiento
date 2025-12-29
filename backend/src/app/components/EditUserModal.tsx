"use client";

import { useState } from 'react';
import styles from './Modal.module.css';

export default function EditUserModal({ user, onClose, onSaved }: { user: any; onClose: () => void; onSaved: (u: any) => void }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [role, setRole] = useState(user?.role || 'user');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Función para generar contraseña automática
  function generatePassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      // Validar contraseña si se proporciona
      if (password.trim() && password.trim().length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        setLoading(false);
        return;
      }

      // Preparar los datos a enviar
      const updateData: any = { name, email, department, role };
      
      // Solo incluir la contraseña si se proporciona
      if (password.trim()) {
        updateData.password = password.trim();
      }

      const res = await fetch(`/api/users/${encodeURIComponent(user.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) throw new Error('Error');
      const d = await res.json();
      onSaved(d.user || d);
      onClose();
    } catch (err) {
      alert('No se pudo actualizar el usuario.');
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
              ✏️
            </div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              Editar Usuario
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
            Modifique los campos necesarios para actualizar el usuario
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

            {/* Campo de contraseña solo para administradores */}
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
                  placeholder="Nueva contraseña (opcional)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = '#8b2635'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <button 
                  type="button" 
                  onClick={generatePassword}
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
                🔑 Dejar vacío para mantener la contraseña actual. Mínimo 6 caracteres para cambiar.
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
                {loading ? '⏳ Actualizando...' : '💾 Actualizar Usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
