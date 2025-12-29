"use client";

import { useState } from 'react';

export default function TicketForm({ onCreated }: { onCreated?: (t: any) => void }) {
  const [userId, setUserId] = useState('');
  const [equipmentId, setEquipmentId] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [observations, setObservations] = useState('');
  const [parts, setParts] = useState<Array<{ nombre: string; cantidad: number }>>([]);
  const [loading, setLoading] = useState(false);

  function handleAddPart() {
    setParts([...parts, { nombre: '', cantidad: 1 }]);
  }
  function handleRemovePart(idx: number) {
    setParts(parts.filter((_, i) => i !== idx));
  }
  function handlePartChange(idx: number, field: 'nombre' | 'cantidad', value: string | number) {
    setParts(parts.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, equipmentId, serviceType, observations, parts }),
      });
      if (!res.ok) throw new Error('error');
      const d = await res.json();
      if (onCreated) onCreated(d.ticket);
      setUserId(''); setEquipmentId(''); setServiceType(''); setObservations(''); setParts([]);
    } catch (err) {
      alert('No se pudo crear ticket');
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} style={{ padding: 8 }} />
        <input placeholder="Equipment ID" value={equipmentId} onChange={(e) => setEquipmentId(e.target.value)} style={{ padding: 8 }} />
        <input placeholder="Servicio" value={serviceType} onChange={(e) => setServiceType(e.target.value)} style={{ padding: 8 }} />
        <input placeholder="Observaciones" value={observations} onChange={(e) => setObservations(e.target.value)} style={{ padding: 8 }} />
      </div>
      <div>
        <strong>Partes y Refacciones:</strong>
        {parts.map((p, idx) => (
          <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
            <input
              placeholder="Nombre de la pieza"
              value={p.nombre}
              onChange={e => handlePartChange(idx, 'nombre', e.target.value)}
              style={{ padding: 8 }}
            />
            <input
              type="number"
              min={1}
              placeholder="Cantidad"
              value={p.cantidad}
              onChange={e => handlePartChange(idx, 'cantidad', Number(e.target.value))}
              style={{ padding: 8, width: 80 }}
            />
            <button type="button" onClick={() => handleRemovePart(idx)} style={{ padding: '0 8px' }}>Eliminar</button>
          </div>
        ))}
        <button type="button" onClick={handleAddPart} style={{ marginTop: 4, padding: '4px 12px' }}>Agregar parte/refacción</button>
      </div>
      <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>{loading ? 'Creando...' : 'Crear'}</button>
    </form>
  );
}
