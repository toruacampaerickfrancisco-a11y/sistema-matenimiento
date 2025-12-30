import React from 'react';

interface SessionTimeoutProps {
  isOpen: boolean;
  onContinue: () => void;
  onLogout: () => void;
}

export const SessionTimeout: React.FC<SessionTimeoutProps> = ({ isOpen, onContinue, onLogout }) => {
  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed' as 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '400px',
      width: '90%',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      textAlign: 'center' as 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    iconContainer: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: '#fdf2f8', // Light pink/red
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 24px auto',
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '12px',
      marginTop: 0,
    },
    message: {
      fontSize: '16px',
      color: '#6b7280',
      marginBottom: '32px',
      lineHeight: '1.5',
    },
    buttonGroup: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      gap: '12px',
    },
    primaryButton: {
      backgroundColor: '#800040',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '14px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'background-color 0.2s',
      width: '100%',
    },
    secondaryButton: {
      backgroundColor: 'white',
      color: '#4b5563',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      padding: '14px 24px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'background-color 0.2s',
      width: '100%',
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.iconContainer}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#800040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>

        <h3 style={styles.title}>
          Sesión Suspendida
        </h3>
        
        <p style={styles.message}>
          Por tu seguridad, hemos bloqueado la sesión debido a inactividad.
          <br />
          <span style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px', display: 'block' }}>
            ¿Deseas continuar trabajando?
          </span>
        </p>

        <div style={styles.buttonGroup}>
          <button
            onClick={onContinue}
            style={styles.primaryButton}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#600030'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#800040'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <polyline points="17 11 19 13 23 9"></polyline>
            </svg>
            Continuar Sesión
          </button>
          
          <button
            onClick={onLogout}
            style={styles.secondaryButton}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};
