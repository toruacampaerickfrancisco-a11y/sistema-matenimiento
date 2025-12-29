"use client";

import React, { useEffect, useState } from 'react';
import styles from './expediente.module.css';

type Location = {
  id: string;
  name: string;
  address?: string;
  department?: string;
};

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/api/locations')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setLocations(data);
        else if (data && Array.isArray(data.locations)) setLocations(data.locations);
        else setLocations([]);
      })
      .catch(() => {
        // fallback sample data
        setLocations([
          { id: 'loc-1', name: 'Almacén Central', address: 'Av. Principal 123', department: 'Logística' },
          { id: 'loc-2', name: 'Bodega Norte', address: 'Calle Norte 45', department: 'Operaciones' }
        ]);
      });
  }, []);

  const filtered = locations.filter(l => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (l.id || '').toLowerCase().includes(q) || (l.name || '').toLowerCase().includes(q) || (l.address || '').toLowerCase().includes(q) || (l.department || '').toLowerCase().includes(q);
  });

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>Ubicaciones</h3>
        
        {/* Barra superior exacta como en la imagen */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 24, 
          marginBottom: 20,
          padding: '0',
          background: 'transparent'
        }}>
          {/* Barra de búsqueda - exacta como la imagen */}
          <div style={{ 
            flex: 1,
            maxWidth: '420px',
            position: 'relative'
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre, dirección, departamento..."
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
          
          {/* Botón de agregar - exacto como la imagen */}
          <button 
            onClick={() => alert('Agregar ubicación (por implementar)')}
            style={{ 
              background: '#249b8a', 
              color: 'white', 
              borderRadius: '8px', 
              padding: '0 18px', 
              border: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              height: '42px',
              whiteSpace: 'nowrap',
              minWidth: 'fit-content'
            }}
          >
            + Agregar
          </button>
        </div>
      </div>

      <div className={styles.card}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40 }}>No hay ubicaciones.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f7f7f8' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: 12 }}>Nombre</th>
                <th style={{ textAlign: 'left', padding: 12 }}>Dirección</th>
                <th style={{ textAlign: 'left', padding: 12 }}>Departamento</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 700 }}>{l.name}</div>
                    <div style={{ fontSize: 12, color: '#777' }}>ID: {l.id}</div>
                  </td>
                  <td style={{ padding: 12 }}>{l.address || '-'}</td>
                  <td style={{ padding: 12 }}>{l.department || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
