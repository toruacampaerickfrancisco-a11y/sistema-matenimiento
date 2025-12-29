"use client";

import React from 'react';
import Link from 'next/link';
import NotificationBell from './NotificationBell';

export default function DashboardLayout({ children, role }: { children: React.ReactNode; role: string }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#0f172a', color: 'white', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 700 }}>MiSistema - {role.toUpperCase()}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <nav style={{ display: 'flex', gap: 12 }}>
            <Link href={`/${role}`}>Inicio</Link>
            <Link href={`/${role}/notifications`}>Notificaciones</Link>
            <Link href="/">Salir</Link>
          </nav>
          {/* Campana de notificaciones */}
          {typeof window !== 'undefined' && (
            <NotificationBell userId={localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser') || '{}').id : ''} />
          )}
        </div>
      </header>
      <main style={{ padding: 24, flex: 1 }}>{children}</main>
    </div>
  );
}
