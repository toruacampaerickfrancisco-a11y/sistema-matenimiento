import ExpedienteLayout from '../components/ExpedienteLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '👨‍💼⚙️ Admin - Sistema Interno de Mantenimiento 🔧💻',
  description: 'Panel Administrativo - Sistema de Mantenimiento de Equipos',
};

export default function AdminPage() {
  return (
    <ExpedienteLayout name="Erick Francisco">
      <div className="emptyState" style={{ width: '100%' }}>
        <div style={{ maxWidth: 480 }}>
          <img src="/images/empty-docs.svg" alt="empty" style={{ width: 180, opacity: 0.95 }} />
          <h3>No cuentas con ningún documento</h3>
          <p>En este espacio se listarán tus identificaciones y documentos digitales.</p>
          <div className="cta">+ Agregar</div>
        </div>
      </div>
    </ExpedienteLayout>
  );
}
