"use client";

import React, { useState } from 'react';
import styles from './MobileCards.module.css';

interface Equipment {
  id: string;
  name: string;
  type: string;
  model?: string;
  serial?: string;
  location?: string;
  status?: string;
  assignedTo?: string;
}

interface EquipmentCardProps {
  equipment: Equipment;
  onEdit?: (equipment: Equipment) => void;
  onDelete?: (equipmentId: string) => void;
  onAssignUser?: (equipmentId: string) => void;
}

export default function EquipmentCard({ equipment, onEdit, onDelete, onAssignUser }: EquipmentCardProps) {
  const [showActions, setShowActions] = useState(false);

  const getStatusDisplay = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'operativo': return '✅ Operativo';
      case 'mantenimiento': return '⚠️ Mantenimiento';
      case 'dañado': return '❌ Dañado';
      case 'disponible': return '🟢 Disponible';
      default: return '❓ Sin estado';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'operativo': return styles.statusOperativo;
      case 'mantenimiento': return styles.statusMantenimiento;
      case 'dañado': return styles.statusDanado;
      case 'disponible': return styles.statusDisponible;
      default: return styles.statusDefault;
    }
  };

  const getEquipmentIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'computadora': case 'pc': case 'laptop': return '💻';
      case 'impresora': return '🖨️';
      case 'monitor': return '🖥️';
      case 'telefono': return '☎️';
      case 'proyector': return '📽️';
      case 'servidor': return '🖲️';
      default: return '⚙️';
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardAvatar}>
          <div className={styles.equipmentIcon}>
            {getEquipmentIcon(equipment.type)}
          </div>
        </div>
        <div className={styles.cardInfo}>
          <h3 className={styles.cardTitle}>{equipment.name}</h3>
          <p className={styles.cardSubtitle}>{equipment.type}</p>
          <span className={`${styles.statusBadge} ${getStatusBadgeClass(equipment.status || '')}`}>
            {getStatusDisplay(equipment.status || '')}
          </span>
        </div>
        <button 
          className={styles.actionToggle}
          onClick={() => setShowActions(!showActions)}
          aria-label="Mostrar acciones"
        >
          ⋮
        </button>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardField}>
          <span className={styles.fieldLabel}>📋 ID:</span>
          <span className={styles.fieldValue}>{equipment.id}</span>
        </div>
        {equipment.model && (
          <div className={styles.cardField}>
            <span className={styles.fieldLabel}>🏷️ Modelo:</span>
            <span className={styles.fieldValue}>{equipment.model}</span>
          </div>
        )}
        {equipment.serial && (
          <div className={styles.cardField}>
            <span className={styles.fieldLabel}>🔢 Serie:</span>
            <span className={styles.fieldValue}>{equipment.serial}</span>
          </div>
        )}
        <div className={styles.cardField}>
          <span className={styles.fieldLabel}>📍 Ubicación:</span>
          <span className={styles.fieldValue}>{equipment.location || 'Sin asignar'}</span>
        </div>
        <div className={styles.cardField}>
          <span className={styles.fieldLabel}>👤 Asignado a:</span>
          <span className={styles.fieldValue}>{equipment.assignedTo || 'Sin asignar'}</span>
        </div>
      </div>

      {showActions && (
        <div className={styles.cardActions}>
          {onEdit && (
            <button 
              className={`${styles.actionBtn} ${styles.actionEdit}`}
              onClick={() => onEdit(equipment)}
            >
              ✏️ Editar
            </button>
          )}
          {onAssignUser && (
            <button 
              className={`${styles.actionBtn} ${styles.actionAssign}`}
              onClick={() => onAssignUser(equipment.id)}
            >
              👤 Asignar Usuario
            </button>
          )}
          {onDelete && (
            <button 
              className={`${styles.actionBtn} ${styles.actionDelete}`}
              onClick={() => onDelete(equipment.id)}
            >
              🗑️ Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
}