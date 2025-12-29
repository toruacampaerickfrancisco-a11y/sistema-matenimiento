"use client";

import React, { useEffect, useState } from 'react';
import styles from './expediente.module.css';

type Equipment = {
  id: number | string;
  type?: string;
  brand?: string;
  model?: string;
  specs?: string;
  userId?: string;
  [k: string]: any;
};

type UserData = {
  id?: number | string;
  name?: string;
  email?: string;
  department?: string;
  [k: string]: any;
};

export default function UserProfile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [assignedEquipment, setAssignedEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) {
        const u = JSON.parse(raw);
        setUser(u);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (!user || !user.id) return;
    let mounted = true;
    fetch('/api/equipment')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        const all: Equipment[] = Array.isArray(data.equipment) ? data.equipment : (data.items || []);
        // Log para depuración
        console.log('User ID:', user.id);
        console.log('Equipos:', all.map((e: Equipment) => ({ id: e.id, userId: e.userId })));
        // Filtrado robusto: compara como string y elimina espacios
        const assigned = all.filter((e: Equipment) => String(e.userId).trim() === String(user.id).trim());
        setAssignedEquipment(assigned);
      })
      .catch(() => {
        setAssignedEquipment([]);
      });
    return () => { mounted = false; };
  }, [user]);

  if (!user) {
    return <div className={styles.card}>No hay usuario en sesión.</div>;
  }

  return (
    <div>
      <h3>Mis datos</h3>
      <div className={styles.card}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <strong>Nombre</strong>
            <div>{user.name || '-'}</div>
          </div>
          <div>
            <strong>Correo</strong>
            <div>{user.email || '-'}</div>
          </div>
          <div>
            <strong>Departamento</strong>
            <div>{user.department || '-'}</div>
          </div>
        </div>
      </div>

      <h4 style={{ marginTop: 18 }}>Equipos asignados</h4>
      {assignedEquipment.length > 0 ? (
        assignedEquipment.map((equipment) => (
          <div className={styles.card} key={equipment.id}>
            <div><strong>Tipo:</strong> {equipment.type || '-'}</div>
            <div><strong>Marca:</strong> {equipment.brand || '-'}</div>
            <div><strong>Modelo:</strong> {equipment.model || '-'}</div>
            <div><strong>Especificaciones:</strong> {equipment.specs || '-'}</div>
            <div><strong>ID:</strong> {String(equipment.id)}</div>
          </div>
        ))
      ) : (
        <div className={styles.card}>No hay equipos asignados a este usuario.</div>
      )}
    </div>
  );
}
