import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useNotificationSound } from './hooks/useNotificationSound';
import { useEventSubscription } from './hooks/useEventUpdates';

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const [previousNotificationCount, setPreviousNotificationCount] = useState(0);
  const [isRinging, setIsRinging] = useState(false);
  
  // 🔊 Hook para sonidos de notificación
  const { playSound, playDoubleBeep } = useNotificationSound({
    volume: 0.7,
    enabled: true,
    soundType: 'ticket'
  });

  // Formatea la fecha/hora
  function formatDate(dateStr: string) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  // Marcar como leído
  async function markAsRead(id: string) {
    try {
      await fetch(`/api/notifications/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setNotifications(nots => nots.map(n => n.id === id ? { ...n, read: 1 } : n));
    } catch {}
  }

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId]);

  // 📡 Suscribirse a eventos de nuevas notificaciones
  useEventSubscription('notification-created', () => {
    // Recargar notificaciones cuando se cree una nueva
    if (userId) {
      setTimeout(() => {
        fetchNotifications();
      }, 500); // Pequeño delay para asegurar que la notificación esté en la BD
    }
  });

  // Función para cargar notificaciones (la sacamos para reutilizar)
  async function fetchNotifications() {
    try {
      const res = await fetch(`/api/notifications?userId=${userId}`);
      const data = await res.json();
      const newNotifications = data.notifications || [];
      
      // 🔊 Detectar nuevas notificaciones y reproducir sonido
      const currentUnreadCount = newNotifications.filter((n: any) => !n.read).length;
      
      // Si hay más notificaciones no leídas que antes, reproducir sonido
      if (previousNotificationCount > 0 && currentUnreadCount > previousNotificationCount) {
        const newNotificationCount = currentUnreadCount - previousNotificationCount;
        console.log(`🔔 ${newNotificationCount} nueva(s) notificación(es) recibida(s)`);
        
        // Reproducir sonido diferente según el tipo
        const hasTicketNotification = newNotifications
          .slice(0, newNotificationCount)
          .some((n: any) => n.message.includes('ticket') || n.message.includes('Ticket') || n.message.includes('🎫'));
        
        // ✨ Activar animación de campana
        setIsRinging(true);
        setTimeout(() => setIsRinging(false), 2000);
        
        if (hasTicketNotification) {
          playDoubleBeep(); // Doble beep para tickets importantes
        } else {
          playSound(); // Sonido simple para otras notificaciones
        }
      }
      
      setPreviousNotificationCount(currentUnreadCount);
      setNotifications(newNotifications);
    } catch {}
  }

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div ref={bellRef} style={{ position: 'relative', marginLeft: 24 }}>
      {!userId && <div style={{ color: 'red', fontWeight: 600 }}>Sin usuario autenticado (currentUser)</div>}
      {userId && (
        <>
          <button
            onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}
            className={isRinging ? 'notification-bell-ringing' : ''}
            aria-label="Notificaciones"
          >
            <span style={{ fontSize: 24 }}>🔔</span>
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: 0, right: 0, background: 'crimson', color: 'white', borderRadius: '50%', padding: '2px 7px', fontSize: 12 }}>
                {unreadCount}
              </span>
            )}
          </button>
          {open && (
            <div style={{ position: 'absolute', right: 0, top: 32, background: 'white', boxShadow: '0 2px 8px #0002', borderRadius: 8, minWidth: 260, zIndex: 10 }}>
              <div style={{ padding: 12, borderBottom: '1px solid #eee', fontWeight: 600 }}>Notificaciones</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, maxHeight: 300, overflowY: 'auto' }}>
                {notifications.length === 0 && <li style={{ padding: 12 }}>No hay notificaciones.</li>}
                {notifications.map(n => {
                  // Extraer datos del mensaje (quién, descripción breve, etc.)
                  // Ejemplo de mensaje: "Nuevo reporte creado por Admin General: El monitor no enciende."
                  let quien = '';
                  let descripcion = '';
                  const msgMatch = n.message.match(/por ([^:]+):?\s*(.*)/);
                  if (msgMatch) {
                    quien = msgMatch[1];
                    descripcion = msgMatch[2];
                  } else {
                    quien = n.message;
                  }
                  // Breve descripción (máx 60 caracteres)
                  const breve = descripcion.length > 60 ? descripcion.slice(0, 57) + '...' : descripcion;
                  const hora = formatDate(n.createdAt || n.created_at);
                  const isUnread = !n.read;
                  // Buscar ticketId en el mensaje (ejemplo: "Ticket #SDDI/0001/2025")
                  const ticketIdMatch = n.message.match(/#([A-Z0-9\/\-]+)/);
                  const ticketId = ticketIdMatch ? ticketIdMatch[1] : null;
                  const handleClick = async () => {
                    // Marcar como leído primero
                    await markAsRead(n.id);
                    
                    if (ticketId) {
                      // Cerrar el panel de notificaciones
                      setOpen(false);
                      
                      // Navegar al ticket con parámetro para abrirlo
                      const encodedTicketId = encodeURIComponent(ticketId);
                      const currentPath = window.location.pathname;
                      if (currentPath.includes('/admin') || currentPath.includes('/tecnico')) {
                        // Si ya estamos en una página de admin o técnico, solo actualizamos los parámetros
                        const newUrl = `${window.location.origin}${currentPath}?open=${encodedTicketId}`;
                        window.location.href = newUrl;
                      } else {
                        // Si no, redirigir a la página apropiada según el rol del usuario
                        const userRole = JSON.parse(localStorage.getItem('currentUser') || '{}').role;
                        if (userRole === 'admin') {
                          window.location.href = `/admin?open=${encodedTicketId}`;
                        } else if (userRole === 'tecnico') {
                          window.location.href = `/tecnico?open=${encodedTicketId}`;
                        }
                      }
                    }
                  };
                  return (
                    <li key={n.id} style={{ padding: 0, borderBottom: 'none' }}>
                      <div
                        style={{ background: isUnread ? '#fff6fa' : '#f6f6f6', borderRadius: 12, padding: '18px 22px', margin: '12px', boxShadow: '0 2px 8px #0001', cursor: ticketId ? 'pointer' : 'default', transition: 'box-shadow 0.2s', border: '1px solid #f3d1e6', display: 'flex', flexDirection: 'column', gap: 6 }}
                        onClick={handleClick}
                      >
                        <div style={{ fontWeight: 600, fontSize: 16, color: '#a11a53', marginBottom: 2, lineHeight: 1.3 }}>
                          <span style={{ fontWeight: 700 }}>{quien}</span>
                          {breve && <span style={{ color: '#a11a53', fontWeight: 400 }}> — {breve}</span>}
                        </div>
                        <div style={{ fontSize: 13, color: '#888', letterSpacing: 0.2 }}>{hora}</div>
                        {isUnread && <span style={{ fontSize: 11, color: 'crimson', fontWeight: 600 }}>No leído</span>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
