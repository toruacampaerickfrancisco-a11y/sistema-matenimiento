'use client';

import React, { useState } from 'react';
import { useNotificationSound } from '../components/hooks/useNotificationSound';

export default function TestSoundPage() {
  const [message, setMessage] = useState('');
  
  const { playSound, playDoubleBeep } = useNotificationSound({
    volume: 0.8,
    enabled: true,
    soundType: 'ticket'
  });

  const testSingleBeep = async () => {
    setMessage('🔊 Reproduciendo sonido simple...');
    await playSound();
    setTimeout(() => setMessage('✅ Sonido simple completado'), 1000);
  };

  const testDoubleBeep = async () => {
    setMessage('🔊 Reproduciendo doble beep para tickets...');
    await playDoubleBeep();
    setTimeout(() => setMessage('✅ Doble beep completado'), 1500);
  };

  const simulateNewTicket = async () => {
    setMessage('🎫 Simulando nuevo ticket de mantenimiento...');
    
    // Simular creación de ticket
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'SDS-1757101631823',
          equipmentId: 'EQ-001',
          serviceType: 'Mantenimiento Preventivo',
          observations: '🔊 PRUEBA DE SONIDO - Ticket creado desde página de prueba'
        })
      });
      
      const data = await response.json();
      
      if (data.ticket) {
        setMessage(`✅ Ticket creado: ${data.ticket.id} - Deberías escuchar notificaciones si hay técnicos logueados`);
        // Reproducir sonido inmediatamente como demostración
        await playDoubleBeep();
      } else {
        setMessage('❌ Error creando ticket');
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '600px', 
      margin: '0 auto',
      backgroundColor: '#f9f9f9',
      borderRadius: '12px',
      marginTop: '20px'
    }}>
      <h1 style={{ 
        color: '#99004d', 
        textAlign: 'center', 
        marginBottom: '30px',
        fontSize: '28px'
      }}>
        🔊 Prueba de Notificaciones con Sonido
      </h1>
      
      <div style={{ 
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '2px solid #99004d'
      }}>
        <p style={{ margin: '0 0 15px 0', color: '#555' }}>
          Esta página te permite probar los sonidos de notificación del sistema de mantenimiento.
        </p>
        <p style={{ margin: '0', color: '#777', fontSize: '14px' }}>
          <strong>Nota:</strong> Asegúrate de que el volumen esté activado y el navegador permita reproducir audio.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button 
          onClick={testSingleBeep}
          style={{
            backgroundColor: '#99004d',
            color: 'white',
            border: 'none',
            padding: '15px 25px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#7b1343'}
          onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#99004d'}
        >
          🔔 Probar Sonido Simple
        </button>

        <button 
          onClick={testDoubleBeep}
          style={{
            backgroundColor: '#a91f4f',
            color: 'white',
            border: 'none',
            padding: '15px 25px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#8a1a3e'}
          onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#a91f4f'}
        >
          🎫 Probar Doble Beep (Tickets)
        </button>

        <button 
          onClick={simulateNewTicket}
          style={{
            backgroundColor: '#d4851a',
            color: 'white',
            border: 'none',
            padding: '15px 25px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#b8731a'}
          onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#d4851a'}
        >
          🛠️ Simular Nuevo Ticket de Mantenimiento
        </button>
      </div>

      {message && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: message.includes('❌') ? '#ffebee' : '#e8f5e8',
          border: `2px solid ${message.includes('❌') ? '#f44336' : '#4caf50'}`,
          borderRadius: '8px',
          color: message.includes('❌') ? '#c62828' : '#2e7d32',
          fontWeight: 'bold'
        }}>
          {message}
        </div>
      )}

      <div style={{ 
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        border: '2px solid #ffc107',
        borderRadius: '8px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>💡 Cómo funciona:</h3>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#856404' }}>
          <li>Las notificaciones suenan automáticamente cuando se crean nuevos tickets</li>
          <li>Los técnicos reciben doble beep para tickets importantes</li>
          <li>El ícono de la campana se anima cuando hay nuevas notificaciones</li>
          <li>El sonido solo se reproduce si el navegador permite audio</li>
        </ul>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <a 
          href="/"
          style={{
            color: '#99004d',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          ← Volver al Login
        </a>
      </div>
    </div>
  );
}