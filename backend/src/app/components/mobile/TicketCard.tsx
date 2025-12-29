"use client";

import React, { useState } from 'react';
import styles from './MobileCards.module.css';

interface Ticket {
  id: string;
  userId: string;
  equipmentId: string;
  serviceType: string;
  observations: string;
  status: string;
  createdAt: string;
  userName?: string;
  equipmentName?: string;
}

interface TicketCardProps {
  ticket: Ticket;
  onEdit?: (ticket: Ticket) => void;
  onDelete?: (ticketId: string) => void;
  onChangeStatus?: (ticketId: string, newStatus: string) => void;
}

export default function TicketCard({ ticket, onEdit, onDelete, onChangeStatus }: TicketCardProps) {
  const [showActions, setShowActions] = useState(false);

  const getStatusDisplay = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'nuevo': return '🆕 Nuevo';
      case 'en_proceso': return '⚡ En Proceso';
      case 'cerrado': return '✅ Cerrado';
      case 'pendiente': return '⏳ Pendiente';
      default: return '❓ Sin estado';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'nuevo': return styles.statusNuevo;
      case 'en_proceso': return styles.statusProceso;
      case 'cerrado': return styles.statusCerrado;
      case 'pendiente': return styles.statusPendiente;
      default: return styles.statusDefault;
    }
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType?.toLowerCase()) {
      case 'reparacion': case 'reparación': return '🔧';
      case 'mantenimiento': return '⚙️';
      case 'instalacion': case 'instalación': return '🔨';
      case 'soporte': return '🛠️';
      case 'revision': case 'revisión': return '🔍';
      default: return '📋';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardAvatar}>
          <div className={styles.serviceIcon}>
            {getServiceIcon(ticket.serviceType)}
          </div>
        </div>
        <div className={styles.cardInfo}>
          <h3 className={styles.cardTitle}>Ticket #{ticket.id}</h3>
          <p className={styles.cardSubtitle}>{ticket.serviceType}</p>
          <span className={`${styles.statusBadge} ${getStatusBadgeClass(ticket.status)}`}>
            {getStatusDisplay(ticket.status)}
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
          <span className={styles.fieldLabel}>👤 Usuario:</span>
          <span className={styles.fieldValue}>{ticket.userName || ticket.userId}</span>
        </div>
        <div className={styles.cardField}>
          <span className={styles.fieldLabel}>⚙️ Equipo:</span>
          <span className={styles.fieldValue}>{ticket.equipmentName || ticket.equipmentId}</span>
        </div>
        <div className={styles.cardField}>
          <span className={styles.fieldLabel}>📅 Fecha:</span>
          <span className={styles.fieldValue}>{formatDate(ticket.createdAt)}</span>
        </div>
        {ticket.observations && (
          <div className={styles.cardField}>
            <span className={styles.fieldLabel}>📝 Observaciones:</span>
            <span className={styles.fieldValue}>{ticket.observations}</span>
          </div>
        )}
      </div>

      {showActions && (
        <div className={styles.cardActions}>
          {onEdit && (
            <button 
              className={`${styles.actionBtn} ${styles.actionEdit}`}
              onClick={() => onEdit(ticket)}
            >
              ✏️ Editar
            </button>
          )}
          {onChangeStatus && ticket.status !== 'cerrado' && (
            <button 
              className={`${styles.actionBtn} ${styles.actionProcess}`}
              onClick={() => onChangeStatus(ticket.id, ticket.status === 'nuevo' ? 'en_proceso' : 'cerrado')}
            >
              {ticket.status === 'nuevo' ? '⚡ Procesar' : '✅ Cerrar'}
            </button>
          )}
          {onDelete && (
            <button 
              className={`${styles.actionBtn} ${styles.actionDelete}`}
              onClick={() => onDelete(ticket.id)}
            >
              🗑️ Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
}