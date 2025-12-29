import ExpedienteLayout from '../components/ExpedienteLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '👤💻 Usuario - Sistema Interno de Mantenimiento ⚙️🔧',
  description: 'Panel Usuario - Sistema de Mantenimiento de Equipos de Cómputo',
};

export default function UserPage() {
  return (
    <ExpedienteLayout name="Usuario">
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
        <div style={{ textAlign: 'center', maxWidth: 520 }}>
          <img src="/images/logo-bienestar-sonora.png" alt="Secretaría de Bienestar Sonora" style={{ width: 120, marginBottom: 18, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
          <h2 style={{ color: '#a11a53', marginBottom: 8 }}>¡Bienvenido al sistema de mantenimiento!</h2>
          <div style={{ color: '#99004d', fontWeight: 600, fontSize: 17, marginBottom: 16 }}>
            Secretaría de Bienestar del Estado de Sonora
          </div>
          <p style={{ fontSize: 18, color: '#333' }}>
            Aquí podrás consultar el estado de tus tickets, reportar incidencias y ver información relevante de tus equipos asignados.
          </p>
        </div>
      </div>
    </ExpedienteLayout>
  );
}
