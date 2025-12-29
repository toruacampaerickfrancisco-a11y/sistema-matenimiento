'use client';

import React from 'react';
import styles from './expediente.module.css';

interface HamburgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function HamburgerMenu({ isOpen, onToggle }: HamburgerMenuProps) {
  return (
    <div className={styles.hamburgerMenu}>
      <button
        onClick={onToggle}
        className={styles.hamburgerButton}
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        {/* Líneas del hamburger con animación */}
        <div
          style={{
            width: '24px',
            height: '3px',
            backgroundColor: 'white',
            margin: '2px 0',
            transition: 'all 0.3s ease',
            transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
            borderRadius: '2px',
          }}
        />
        <div
          style={{
            width: '24px',
            height: '3px',
            backgroundColor: 'white',
            margin: '2px 0',
            transition: 'all 0.3s ease',
            opacity: isOpen ? '0' : '1',
            borderRadius: '2px',
          }}
        />
        <div
          style={{
            width: '24px',
            height: '3px',
            backgroundColor: 'white',
            margin: '2px 0',
            transition: 'all 0.3s ease',
            transform: isOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none',
            borderRadius: '2px',
          }}
        />
      </button>
    </div>
  );
}