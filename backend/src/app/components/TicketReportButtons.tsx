"use client";
import React from 'react';
import { NotificationSound } from './NotificationSound';

type Props = {
  ticket: any;
  size?: 'small' | 'normal';
};

export default function ReportExportButton({ ticket, size = 'normal' }: Props) {


  const handleExportPDF = async () => {
    try {
      console.log('🏛️ Generando REPORTE OFICIAL del Gobierno de Sonora para ticket:', ticket.id);
      
      const res = await fetch('/api/reports/generate-official', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ticket.id }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error del servidor: ${errorText}`);
      }
      
      const htmlContent = await res.text();
      
      // Abrir el contenido en una nueva ventana para imprimir como PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Configurar la ventana para impresión
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 500);
        };
      }
      
      NotificationSound.playSuccessSound();
      console.log('✅ Reporte PDF oficial generado exitosamente');
      
    } catch (err) {
      console.error('❌ Error generando el reporte PDF:', err);
      alert('Error generando el reporte PDF oficial: ' + String(err));
    }
  };

  if (size === 'small') {
    return (
      <button 
        title="Generar Reporte Oficial PDF"
        onClick={handleExportPDF} 
        style={{ 
          padding: '6px 12px',
          background: '#8B1538',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        🏛️ PDF
      </button>
    );
  }

  return (
    <button 
      onClick={handleExportPDF} 
      style={{ 
        padding: '12px 20px',
        background: '#8B1538',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}
    >
      🏛️ REPORTE OFICIAL GOBIERNO
    </button>
  );
}