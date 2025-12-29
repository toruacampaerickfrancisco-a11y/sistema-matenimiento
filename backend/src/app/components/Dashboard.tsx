'use client';
import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
type Ticket = { status: string };
type DashboardProps = {
  onNavigateModule?: (module: 'dashboard'|'profile'|'reports'|'users'|'equipment'|'tickets'|'perms'|'settings') => void;
};

export default function Dashboard({ onNavigateModule }: DashboardProps) {
  const [stats, setStats] = useState({
    ticketsTotal: 0,
    ticketsAbiertos: 0,
    ticketsCerrados: 0,
    ticketsProceso: 0,
    users: 0,
    equipment: 0,
  });
  useEffect(() => {
    async function fetchStats() {
      try {
        const [ticketsRes, usersRes, eqRes] = await Promise.all([
          fetch('/api/tickets'),
          fetch('/api/users'),
          fetch('/api/equipment'),
        ]);
        const ticketsData = await ticketsRes.json();
        const usersData = await usersRes.json();
        const eqData = await eqRes.json();
        const tickets: Ticket[] = ticketsData.tickets || [];
        setStats({
          ticketsTotal: tickets.length,
          ticketsAbiertos: tickets.filter((t: Ticket) => t.status === 'nuevo').length,
          ticketsCerrados: tickets.filter((t: Ticket) => t.status === 'cerrado').length,
          ticketsProceso: tickets.filter((t: Ticket) => t.status === 'en_proceso').length,
          users: (usersData.users || usersData).length,
          equipment: (eqData.equipment || eqData.items || []).length,
        });
      } catch (e) {}
    }
    fetchStats();
  }, []);

  // Navegación para los cards (usa onNavigateModule si está disponible)
  const goTickets = () => onNavigateModule ? onNavigateModule('tickets') : undefined;
  const goUsers = () => onNavigateModule ? onNavigateModule('users') : undefined;
  const goEquipment = () => onNavigateModule ? onNavigateModule('equipment') : undefined;



  return (
    <>
      <div style={{ display: 'flex', gap: '60px', justifyContent: 'center', marginBottom: '40px' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '48px', fontWeight: '700', color: '#2c3e50', margin: '0' }}>{stats.ticketsTotal}</h3>
          <p style={{ color: '#6c757d', margin: '4px 0 0 0', fontSize: '18px', fontWeight: '500' }}>Total de Tickets</p>
          <div style={{ fontSize: '15px', fontWeight: '600', marginTop: '8px', color: '#27AE60' }}>↗ Total en sistema</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '48px', fontWeight: '700', color: '#2c3e50', margin: '0' }}>{stats.ticketsAbiertos}</h3>
          <p style={{ color: '#6c757d', margin: '4px 0 0 0', fontSize: '18px', fontWeight: '500' }}>Tickets Abiertos</p>
          <div style={{ fontSize: '15px', fontWeight: '600', marginTop: '8px', color: '#E74C3C' }}>↘ Pendientes</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '48px', fontWeight: '700', color: '#2c3e50', margin: '0' }}>{stats.ticketsProceso}</h3>
          <p style={{ color: '#6c757d', margin: '4px 0 0 0', fontSize: '18px', fontWeight: '500' }}>En Proceso</p>
          <div style={{ fontSize: '15px', fontWeight: '600', marginTop: '8px', color: '#27AE60' }}>↗ En progreso</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '48px', fontWeight: '700', color: '#2c3e50', margin: '0' }}>{stats.ticketsCerrados}</h3>
          <p style={{ color: '#6c757d', margin: '4px 0 0 0', fontSize: '18px', fontWeight: '500' }}>Tickets Cerrados</p>
          <div style={{ fontSize: '15px', fontWeight: '600', marginTop: '8px', color: '#27AE60' }}>↗ Completados</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', border: '1px solid #e9ecef' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
            � Resumen de Usuarios
            <button onClick={goUsers} style={{ marginLeft: 'auto', background: 'none', border: '1px solid #4A90E2', color: '#4A90E2', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
              Ver todos
            </button>
          </h3>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 0', borderBottom: '1px solid #f1f3f4' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#4A90E2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>�</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#2c3e50' }}>Total de Usuarios</div>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>{stats.users} usuarios registrados</div>
              </div>
              <span style={{ background: '#27AE60', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>activos</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 0', borderBottom: '1px solid #f1f3f4' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F39C12', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>�</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#2c3e50' }}>Equipos Registrados</div>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>{stats.equipment} equipos en sistema</div>
              </div>
              <span style={{ background: '#4A90E2', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>disponibles</span>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', border: '1px solid #e9ecef' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '18px', fontWeight: '600' }}>📊 Estadísticas del Sistema</h3>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 0', borderBottom: '1px solid #f1f3f4' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#27AE60', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>�</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#2c3e50' }}>Tickets Resueltos</div>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>{stats.ticketsCerrados} de {stats.ticketsTotal} total</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>Tasa de resolución: {stats.ticketsTotal > 0 ? Math.round((stats.ticketsCerrados / stats.ticketsTotal) * 100) : 0}%</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 0', borderBottom: '1px solid #f1f3f4' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F39C12', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>⏱️</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#2c3e50' }}>Tickets Pendientes</div>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>{stats.ticketsAbiertos + stats.ticketsProceso} tickets activos</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>Requieren atención</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 0' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#8E44AD', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🎯</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#2c3e50' }}>Estado del Sistema</div>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>Sistema operativo</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>Último registro: Hoy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
