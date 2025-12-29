"use client";

import React from 'react';
import styles from './Table.module.css';

export default function ActionButtons({ onView, onEdit, onDelete, onExport, size = 14, className = '' }: { onView?: () => void; onEdit?: () => void; onDelete?: () => void; onExport?: () => void; size?: number; className?: string }) {
  return (
    <div style={{ display: 'flex', gap: 3 }} className={className}>
      {onView ? (
        <button title="Ver" onClick={onView} className={styles.actionBtn}>
          <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
            <path fill="currentColor" d="M12 5c-7 0-11 6-11 7s4 7 11 7 11-6 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z" />
            <circle cx="12" cy="12" r="2.5" fill="white" />
          </svg>
        </button>
      ) : null}

      {onEdit ? (
        <button title="Editar" onClick={onEdit} className={styles.actionBtn}>
          <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
            <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
      ) : null}

      {onDelete ? (
        <button title="Eliminar" onClick={onDelete} className={`${styles.actionBtn} ${styles.delete}`}>
          <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
            <path fill="currentColor" d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>
      ) : null}
      {onExport ? (
        <button title="Generar documento" onClick={onExport} className={styles.actionBtn}>
          <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
            <path fill="currentColor" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM13 3.5L18.5 9H13V3.5zM12 12v4h-2v-4H7l5-5 5 5h-5z" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
