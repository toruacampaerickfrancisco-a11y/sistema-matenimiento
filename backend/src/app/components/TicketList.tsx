"use client";

import { useEffect, useMemo, useState } from 'react';
import TicketDetails from './TicketDetails';
import ActionButtons from './ActionButtons';
import styles from './Table.module.css';
import { usePreciseUpdates } from './hooks/usePreciseUpdates';


export default function TicketList() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const columns = ['id', 'userId', 'equipmentId', 'activoFijo', 'equipmentStatus', 'serviceType', 'department', 'status'];
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Obtener el usuario actual del localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) setCurrentUser(JSON.parse(raw));
    } catch (_) {}
  }, []);

  // 🎯 Manejar parámetros URL para abrir ticket específico
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const openTicketId = urlParams.get('open');
    
    if (openTicketId && tickets.length > 0) {
      // Decodificar el ID del ticket por si tiene caracteres especiales
      const decodedTicketId = decodeURIComponent(openTicketId);
      const targetTicket = tickets.find(t => t.id.toString() === decodedTicketId);
      if (targetTicket) {
        setSelected(targetTicket);
        // Limpiar el parámetro URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('open');
        window.history.replaceState({}, '', newUrl.toString());
      }
    }
  }, [tickets]);

  // � TEMPORALMENTE DESHABILITADO para optimización
  // const { isConnected } = useRealtime({
  //   userId: currentUser?.id || 'guest',
  //   enableSmartUpdates: true,
  //   reconnectInterval: 30000, // Reconectar cada 30 segundos
  //   onEvent: (event) => {
  //     if (event.type === 'new-ticket-for-technicians' || event.type === 'ticket-updated') {
  //       // Forzar actualización inmediata solo cuando hay eventos relevantes
  //       // forceTicketUpdate();
  //     }
  //   },
  // });
  const isConnected = false; // Placeholder temporal

  // 🎯 Sistema de actualización por eventos precisos para tickets
  const { data: ticketsData, forceUpdate: forceTicketUpdate, triggerEvent } = usePreciseUpdates({
    endpoint: '/api/tickets',
    eventTypes: ['ticket-created', 'ticket-updated', 'ticket-deleted'],
    enabled: !!currentUser,
    onUpdate: (data) => {
      let ticketsList = data.tickets || [];
      // Filtrar por rol sin mostrar loading
      if (currentUser && currentUser.role === 'user') {
        ticketsList = ticketsList.filter((t: any) => t.userId === currentUser.id);
      }
      
      setTickets(ticketsList);
      setTotal(ticketsList.length);
    },
    cacheKey: `tickets-${currentUser?.role}-${currentUser?.id}`
  });

  // Función para cargar tickets con loading visible
  const loadTickets = async () => {
    setLoading(true);
    await loadTicketsData();
    setLoading(false);
  };

  // Función para cargar tickets silenciosamente (sin loading visible)
  const loadTicketsSilently = async () => {
    await loadTicketsData();
  };

  // Función base para cargar datos de tickets
  const loadTicketsData = async () => {
    try {
      const params = new URLSearchParams();
      if (q) params.append('q', q);
      if (statusFilter) params.append('status', statusFilter);
      params.append('page', String(page));
      params.append('pageSize', String(pageSize));
      params.append('sortBy', sortBy);
      params.append('sortDir', sortDir);
      
      const res = await fetch(`/api/tickets?${params.toString()}`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json().catch(() => ({}));
      
      let ticketsList = data.tickets || [];
      // Si el usuario es 'user', filtrar solo sus tickets
      if (currentUser && currentUser.role === 'user') {
        ticketsList = ticketsList.filter((t: any) => t.userId === currentUser.id);
      }
      
      // Solo actualizar si hay cambios reales
      const hasChanges = JSON.stringify(ticketsList) !== JSON.stringify(tickets);
      if (hasChanges) {
        setTickets(ticketsList);
        setTotal(ticketsList.length);
      }
    } catch (err) {
      console.error('Error cargando tickets:', err);
    }
  };

  // Cargar datos inicial solo cuando cambian filtros (con loading visible)
  useEffect(() => {
    if (currentUser) {
      loadTickets(); // Solo mostrar loading en cambios de filtro
    }
  }, [q, statusFilter, page, pageSize, sortBy, sortDir, currentUser]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  function handleSaved(updated: any) {
    setTickets((s) => s.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)));
    
    // 🔥 Disparar evento de ticket actualizado
    triggerEvent('ticket-updated', { ticket: updated });
  }

  async function handleExportTicket(ticket: any) {
    try {
      console.log('🚀 Generando reporte para ticket:', ticket.id);
      
      // Call the reports generation endpoint with the ticket id
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ticket.id })
      });
      
      if (!res.ok) throw new Error('Error generating document');
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const filename = `reporte-${ticket.id}.docx`;
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      
      // 🎉 Reproducir sonido de éxito - importar dinámicamente para evitar errores SSR
      try {
        const { NotificationSound } = await import('./NotificationSound');
        NotificationSound.playSuccessSound();
        console.log('✅ Reporte generado exitosamente con sonido');
      } catch (soundError) {
        console.log('📢 Reporte generado (sin sonido):', soundError);
      }
      
    } catch (err) {
      console.error('❌ Error generando documento:', err);
      alert('No se pudo generar el documento');
    }
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Primera fila: Filtros - Unificado con el estilo de otras tablas */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-end', 
        gap: 20, 
        marginBottom: 16,
        width: '100%'
      }}>
        {/* Filtros de la izquierda - mismo estilo que UsersTable */}
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
              ESTADO
            </label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter((e.target as HTMLSelectElement).value); setPage(1); }}
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
              <option value="">Todos los Estados</option>
              <option value="open">Abiertos</option>
              <option value="in_progress">En progreso</option>
              <option value="closed">Cerrados</option>
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
              ELEMENTOS POR PÁGINA
            </label>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number((e.target as HTMLSelectElement).value)); setPage(1); }}
              style={{
                width: '140px',
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
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Barra de búsqueda centrada - mismo estilo que UsersTable */}
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
              placeholder="Buscar por ID, usuario, equipo..."
              aria-label="Buscar tickets"
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
        
        {/* Botón de exportar - mismo estilo que UsersTable */}
        <button 
          onClick={() => {
            const csvContent = "data:text/csv;charset=utf-8," + 
              "ID,Usuario,Equipo,Activo Fijo,Estado Equipo,Tipo Servicio,Departamento,Estado Ticket,Fecha Creación\n" +
              tickets.map(t => 
                `${t.id},"${t.userId}","${t.equipmentId}","${t.activoFijo || 'N/A'}","${t.equipmentStatus || 'Activo'}","${t.serviceType}","${t.department || 'N/A'}","${t.status}","${new Date(t.createdAt).toLocaleDateString()}"`
              ).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "tickets.csv");
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

  <div className={`${styles.tableWrapper} ${styles.large}`}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>ID</th>
              <th className={styles.th}>Usuario</th>
              <th className={styles.th}>Equipo</th>
              <th className={styles.th}>Activo Fijo</th>
              <th className={styles.th}>Estado Equipo</th>
              <th className={styles.th}>Tipo Servicio</th>
              <th className={styles.th}>Departamento</th>
              <th className={styles.th}>Estado Ticket</th>
              <th className={styles.th} style={{ width: 120 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr><td className={styles.td} colSpan={9}>No hay tickets.</td></tr>
            ) : (
              tickets.map((t) => (
                <tr key={t.id} className={styles.tr}>
                  <td className={styles.td}>{t.id || '-'}</td>
                  <td className={styles.td}>{t.userId || '-'}</td>
                  <td className={styles.td}>{t.equipmentId || '-'}</td>
                  <td className={styles.td}>{t.activoFijo || 'Sin asignar'}</td>
                  <td className={styles.td}>{t.equipmentStatus || 'Activo'}</td>
                  <td className={styles.td}>{t.serviceType || '-'}</td>
                  <td className={styles.td}>{t.department || 'N/A'}</td>
                  <td className={styles.td}>{t.status}</td>
                  <td className={styles.actionsCell}>
                    <ActionButtons
                      onView={() => setSelected(t)}
                      onEdit={() => setSelected(t)}
                      onDelete={async () => {
                        if (!confirm('¿Eliminar este ticket?')) return;
                        try {
                          const res = await fetch(`/api/tickets/${t.id}`, { method: 'DELETE' });
                          if (!res.ok) throw new Error('Error');
                          setTickets(s => s.filter(x => x.id !== t.id));
                        } catch (err) {
                          alert('No se pudo eliminar el ticket');
                        }
                      }}
                      size={22}
                      onExport={() => handleExportTicket(t)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, alignItems: 'center' }}>
        <div>Mostrando {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} de {total}</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</button>
          <div>Page {page} / {totalPages}</div>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Siguiente</button>
        </div>
      </div>

      {selected ? <TicketDetails ticket={selected} onClose={() => setSelected(null)} onSaved={handleSaved} /> : null}
    </div>
  );
}
