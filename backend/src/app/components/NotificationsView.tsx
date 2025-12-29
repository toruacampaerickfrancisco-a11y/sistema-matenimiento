import React, { useEffect, useState } from 'react';

export default function NotificationsView({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/notifications?userId=${userId}`);
        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch (err) {
        setError('No se pudieron cargar las notificaciones.');
      }
      setLoading(false);
    }
    if (userId) fetchNotifications();
  }, [userId]);

  if (loading) return <div>Cargando notificaciones...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!notifications.length) return <div>No tienes notificaciones.</div>;

  return (
    <div>
      <h2>Notificaciones</h2>
      <ul>
        {notifications.map(n => (
          <li key={n.id} style={{ marginBottom: 12 }}>
            <strong>{n.message}</strong>
            <br />
            <span style={{ fontSize: 12, color: '#555' }}>{n.created_at}</span>
            {n.read ? null : <span style={{ color: 'green', marginLeft: 8 }}>● Nueva</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
