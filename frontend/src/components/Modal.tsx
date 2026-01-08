import React from 'react';
import { X, Home, ChevronRight } from 'lucide-react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  footer?: React.ReactNode;
  breadcrumb?: string; // Ruta personalizada ej: "Inicio / Equipos"
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
  breadcrumb
}) => {
  if (!isOpen) return null;

  // Si size es 'full', forzamos un breadcrumb por defecto si no existe
  const displayBreadcrumb = breadcrumb;

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${styles[size]}`}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            {/* Breadcrumb Navigation */}
            {(displayBreadcrumb || size === 'full') && (
              <div className={styles.breadcrumb}>
                <Home size={14} style={{ marginRight: '6px' }} />
                <span>Inicio</span>
                {displayBreadcrumb ? (
                   // Parsear string "Seccion / Subseccion"
                   displayBreadcrumb.split('/').map((part, idx) => (
                    <React.Fragment key={idx}>
                      <ChevronRight size={14} className={styles.breadcrumbSeparator} />
                      <span>{part.trim()}</span>
                    </React.Fragment>
                   ))
                ) : (
                  // Default fallback
                  <>
                     <ChevronRight size={14} className={styles.breadcrumbSeparator} />
                     <span>Acciones</span>
                  </>
                )}
              </div>
            )}
            
            <h2 className={styles.title}>{title}</h2>
          </div>

          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className={styles.body}>
          {children}
        </div>
        
        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;