"use client";

import React, { useState } from 'react';
import styles from './MobileCards.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  onAssignEquipment?: (userId: string) => void;
}

export default function UserCard({ user, onEdit, onDelete, onAssignEquipment }: UserCardProps) {
  const [showActions, setShowActions] = useState(false);

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin': return '👨‍💼 Administrador';
      case 'tecnico': return '🔧 Técnico';
      case 'user': return '👤 Usuario';
      default: return '👤 Usuario';
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin': return styles.badgeAdmin;
      case 'tecnico': return styles.badgeTecnico;
      case 'user': return styles.badgeUser;
      default: return styles.badgeUser;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardAvatar}>
          <div className={styles.avatarCircle}>
            {user.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
          </div>
        </div>
        <div className={styles.cardInfo}>
          <h3 className={styles.cardTitle}>{user.name}</h3>
          <p className={styles.cardSubtitle}>{user.email}</p>
          <span className={`${styles.roleBadge} ${getRoleBadgeClass(user.role)}`}>
            {getRoleDisplay(user.role)}
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
          <span className={styles.fieldValue}>{user.id}</span>
        </div>
        <div className={styles.cardField}>
          <span className={styles.fieldLabel}>🏢 Departamento:</span>
          <span className={styles.fieldValue}>{user.department || 'Sin asignar'}</span>
        </div>
      </div>

      {showActions && (
        <div className={styles.cardActions}>
          {onEdit && (
            <button 
              className={`${styles.actionBtn} ${styles.actionEdit}`}
              onClick={() => onEdit(user)}
            >
              ✏️ Editar
            </button>
          )}
          {onAssignEquipment && (
            <button 
              className={`${styles.actionBtn} ${styles.actionAssign}`}
              onClick={() => onAssignEquipment(user.id)}
            >
              🔧 Asignar Equipo
            </button>
          )}
          {onDelete && (
            <button 
              className={`${styles.actionBtn} ${styles.actionDelete}`}
              onClick={() => onDelete(user.id)}
            >
              🗑️ Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
}