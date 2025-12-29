import React from 'react';

// Figura para Dashboard - Cuadrado con gradiente
export const DashboardIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <div 
    style={{
      width: size,
      height: size,
      background: 'linear-gradient(135deg, #e91e63 0%, #8e24aa 100%)',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }}
  />
);

// Figura para Usuarios - Círculo
export const UsersIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <div 
    style={{
      width: size,
      height: size,
      background: 'linear-gradient(135deg, #f06292 0%, #ad1457 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }}
  />
);

// Figura para Equipos - Triángulo
export const EquipmentIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <div 
    style={{
      width: 0,
      height: 0,
      borderLeft: `${size/2}px solid transparent`,
      borderRight: `${size/2}px solid transparent`,
      borderBottom: `${size}px solid #9c27b0`,
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
    }}
  />
);

// Figura para Tickets - Rombo
export const TicketsIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <div 
    style={{
      width: size,
      height: size,
      background: 'linear-gradient(135deg, #ba68c8 0%, #7b1fa2 100%)',
      transform: 'rotate(45deg)',
      borderRadius: '2px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }}
  />
);

// Figura para Reportes - Hexágono
export const ReportsIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <div 
    style={{
      width: size,
      height: size * 0.866, // altura del hexágono
      background: 'linear-gradient(135deg, #ce93d8 0%, #6a1b9a 100%)',
      position: 'relative',
      clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
    }}
  />
);

// Figura para Permisos - Pentágono
export const PermissionsIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <div 
    style={{
      width: size,
      height: size,
      background: 'linear-gradient(135deg, #e1bee7 0%, #4a148c 100%)',
      clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
    }}
  />
);

// Figura para Logout - Octágono
export const LogoutIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <div 
    style={{
      width: size,
      height: size,
      background: 'linear-gradient(135deg, #f8bbd9 0%, #880e4f 100%)',
      clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
    }}
  />
);

// Figura para Profile - Estrella
export const ProfileIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <div 
    style={{
      width: size,
      height: size,
      background: 'linear-gradient(135deg, #f48fb1 0%, #ad1457 100%)',
      clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
    }}
  />
);