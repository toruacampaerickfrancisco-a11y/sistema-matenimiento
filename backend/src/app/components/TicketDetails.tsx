"use client";

import { useEffect, useState } from "react";
import styles from './Modal.module.css';

export default function TicketDetails({ ticket, onClose, onSaved }: { ticket: any; onClose: () => void; onSaved: (t: any) => void; }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Estados para los campos del formulario
  const [diagnostic, setDiagnostic] = useState(ticket?.diagnostic || '');
  const [repair, setRepair] = useState(ticket?.repair || '');
  const [parts, setParts] = useState(ticket?.parts || '');
  const [status, setStatus] = useState(ticket?.status || 'nuevo');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) setCurrentUser(JSON.parse(raw));
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (!ticket?.id) return;
    setHistory([]);
    fetch(`/api/tickets/${ticket.id}/history`)
      .then(res => res.json())
      .then(data => setHistory(data.history || []))
      .catch(() => console.error('No se pudo cargar el historial.'));
  }, [ticket]);

  const canEdit = currentUser?.role === 'admin' || currentUser?.role === 'tecnico';

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/tickets/${ticket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagnostic, repair, parts, status }),
      });
      if (!res.ok) throw new Error('No se pudo guardar el ticket.');
      const updatedTicket = await res.json();
      onSaved(updatedTicket.ticket || updatedTicket);
      setMessage('Guardado exitosamente.');
      setIsEditing(false);
    } catch (err) {
      setMessage('Error al guardar.');
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nuevo': return '#f59e0b';
      case 'en_proceso': return '#3b82f6';
      case 'cerrado': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'nuevo': return '🆕 Nuevo';
      case 'en_proceso': return '🔄 En Proceso';
      case 'cerrado': return '✅ Cerrado';
      default: return status;
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} style={{ width: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            🎫 Ticket #{ticket.id}
          </h2>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {/* Información del Ticket */}
          <div style={{ 
            background: '#f8fafc', 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px', 
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>
                  👤 Usuario Solicitante
                </span>
                <div style={{ fontWeight: '500', color: '#1e293b' }}>{ticket.userId}</div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>
                  🖥️ Equipo
                </span>
                <div style={{ fontWeight: '500', color: '#1e293b' }}>{ticket.equipmentId}</div>
              </div>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>
                🔧 Tipo de Servicio
              </span>
              <div style={{ fontWeight: '500', color: '#1e293b' }}>{ticket.serviceType}</div>
            </div>

            <div>
              <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>
                📝 Descripción del Problema
              </span>
              <div style={{ 
                background: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '4px',
                whiteSpace: 'pre-wrap',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                {ticket.observations}
              </div>
            </div>
          </div>

          {/* Estado Actual */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginBottom: '20px',
            padding: '12px',
            background: getStatusColor(ticket.status) + '20',
            border: `2px solid ${getStatusColor(ticket.status)}40`,
            borderRadius: '8px'
          }}>
            <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>
              Estado Actual:
            </span>
            <span style={{ 
              background: getStatusColor(ticket.status),
              color: 'white',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {getStatusText(ticket.status)}
            </span>
          </div>

        <form onSubmit={handleSave}>
          {canEdit ? (
            <>
              <h3 style={{ 
                margin: '0 0 16px 0', 
                fontSize: '18px', 
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🔧 Información Técnica
              </h3>
              
              <div className={styles.form}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>🔍 Diagnóstico Técnico</label>
                  <textarea 
                    value={diagnostic} 
                    onChange={e => setDiagnostic(e.target.value)}
                    className={styles.textarea}
                    placeholder="Escriba el diagnóstico técnico detallado del problema encontrado..."
                    rows={4}
                  />
                  <p className={styles.helpText}>
                    💡 Describa el problema identificado y las causas técnicas
                  </p>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>🔨 Reparación Realizada</label>
                  <textarea 
                    value={repair} 
                    onChange={e => setRepair(e.target.value)}
                    className={styles.textarea}
                    placeholder="Detalle las acciones de reparación ejecutadas..."
                    rows={4}
                  />
                  <p className={styles.helpText}>
                    🛠️ Especifique qué reparaciones se realizaron paso a paso
                  </p>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>🔩 Partes y Refacciones</label>
                  <textarea 
                    value={parts} 
                    onChange={e => setParts(e.target.value)}
                    className={styles.textarea}
                    placeholder="Liste las partes utilizadas o requeridas (ej: 1 x Memoria RAM 8GB, 2 x Tornillos M3...)"
                    rows={3}
                  />
                  <p className={styles.helpText}>
                    📦 Formato: cantidad x descripción (una por línea)
                  </p>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>📊 Estado del Ticket</label>
                  <select 
                    value={status} 
                    onChange={e => setStatus(e.target.value)}
                    className={styles.select}
                  >
                    <option value="nuevo">🆕 Nuevo</option>
                    <option value="en_proceso">🔄 En Proceso</option>
                    <option value="cerrado">✅ Cerrado</option>
                  </select>
                  <p className={styles.helpText}>
                    ⚡ Actualice el estado según el progreso del trabajo
                  </p>
                </div>

                {message && (
                  <div style={{ 
                    padding: '12px',
                    borderRadius: '8px',
                    background: message.includes('Error') ? '#fef2f2' : '#f0fdf4',
                    border: `1px solid ${message.includes('Error') ? '#fecaca' : '#bbf7d0'}`,
                    color: message.includes('Error') ? '#dc2626' : '#166534',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {message.includes('Error') ? '❌' : '✅'} {message}
                  </div>
                )}

                <div className={styles.actions}>
                  <button 
                    type="button"
                    className={`${styles.button} ${styles.buttonSecondary}`}
                    onClick={onClose}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className={`${styles.button} ${styles.buttonPrimary}`}
                    disabled={loading}
                  >
                    {loading ? '⏳ Guardando...' : '💾 Guardar Cambios'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 style={{ 
                margin: '0 0 16px 0', 
                fontSize: '18px', 
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🔧 Información Técnica
              </h3>
              
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ 
                  background: '#f8fafc', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>
                    🔍 Diagnóstico Técnico
                  </div>
                  <div style={{ color: '#1e293b' }}>{ticket.diagnostic || 'Pendiente de diagnóstico'}</div>
                </div>

                <div style={{ 
                  background: '#f8fafc', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>
                    🔨 Reparación Realizada
                  </div>
                  <div style={{ color: '#1e293b' }}>{ticket.repair || 'Sin reparaciones registradas'}</div>
                </div>

                <div style={{ 
                  background: '#f8fafc', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>
                    🔩 Partes y Refacciones
                  </div>
                  <div style={{ color: '#1e293b' }}>
                    {(() => {
                      let partsList = [];
                      if (ticket.parts) {
                        try {
                          if (typeof ticket.parts === 'string') {
                            partsList = JSON.parse(ticket.parts);
                          } else if (Array.isArray(ticket.parts)) {
                            partsList = ticket.parts;
                          }
                        } catch (e) {
                          partsList = [];
                        }
                      }
                      if (!partsList.length) return <span>Sin partes registradas</span>;
                      return (
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                          {partsList.map((p: any, idx: number) => (
                            <li key={idx} style={{ marginBottom: '4px' }}>
                              <strong>{p.cantidad}</strong> x {p.nombre}
                            </li>
                          ))}
                        </ul>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </>
          )}
        </form>

          {history.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ 
                margin: '0 0 16px 0', 
                fontSize: '18px', 
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderTop: '1px solid #e2e8f0',
                paddingTop: '16px'
              }}>
                📋 Historial de Cambios
              </h3>
              
              <div style={{ 
                maxHeight: '200px', 
                overflowY: 'auto',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                background: '#fafafa'
              }}>
                {history.map((entry, index) => (
                  <div 
                    key={entry.id || index} 
                    style={{ 
                      padding: '12px',
                      borderBottom: index < history.length - 1 ? '1px solid #e2e8f0' : 'none',
                      background: index % 2 === 0 ? 'white' : '#f8fafc'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      marginBottom: '4px'
                    }}>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '500',
                        color: '#1e293b'
                      }}>
                        👤 {entry.userName || 'Sistema'}
                      </div>
                      <div style={{ 
                        fontSize: '11px', 
                        color: '#64748b',
                        textAlign: 'right'
                      }}>
                        {new Date(entry.createdAt * 1000).toLocaleString()}
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '13px', color: '#475569', marginBottom: '2px' }}>
                      Modificó: <strong>{entry.fieldChanged}</strong>
                    </div>
                    
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#64748b',
                      background: '#f1f5f9',
                      padding: '6px 8px',
                      borderRadius: '4px',
                      borderLeft: '3px solid #3b82f6'
                    }}>
                      <span style={{ color: '#dc2626' }}>De:</span> "{entry.oldValue || 'vacío'}" 
                      <span style={{ margin: '0 8px', color: '#64748b' }}>→</span> 
                      <span style={{ color: '#059669' }}>A:</span> "{entry.newValue || 'vacío'}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
