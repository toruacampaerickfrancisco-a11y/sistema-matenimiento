import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { tickets } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id: ticketId } = body;

    if (!ticketId) {
      return NextResponse.json({ message: 'Ticket ID es requerido' }, { status: 400 });
    }

    // Obtener datos del ticket con relaciones
    const ticketData = await db.query.tickets.findFirst({
      where: eq(tickets.id, ticketId),
      with: {
        user: true,
        equipment: true,
      },
    });

    // Debug: Verificar datos del equipo
    console.log('🔧 Debug - Datos del equipo:', {
      equipmentId: ticketData?.equipment?.id,
      type: ticketData?.equipment?.type,
      processor: ticketData?.equipment?.processor,
      ram: ticketData?.equipment?.ram,
      storage: ticketData?.equipment?.storage,
      os: ticketData?.equipment?.os,
      other_specs: ticketData?.equipment?.other_specs
    });

    if (!ticketData) {
      return NextResponse.json({ message: 'Ticket no encontrado' }, { status: 404 });
    }

    // Leer template del gobierno
    const templatePath = path.join(process.cwd(), 'templates', 'formato-oficial-gobierno.html');
    
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json({ message: 'Template no encontrado' }, { status: 404 });
    }
    
    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

    // Procesar datos del usuario
    const nombreCompleto = ticketData.user?.name || ticketData.userId || 'Usuario no especificado';
    const nombres = nombreCompleto.split(' ');
    const primerNombre = nombres[0] || '';
    const apellidos = nombres.slice(1).join(' ') || '';

    // Determinar tipo de servicio con validación
    const serviceType = (ticketData.serviceType || '').toLowerCase();
    const isPreventivo = serviceType.includes('preventivo') || serviceType.includes('mantenimiento');
    const isCorrectivo = serviceType.includes('correctivo') || serviceType.includes('reparación') || serviceType.includes('reparacion');
    const isInstalacion = serviceType.includes('instalación') || serviceType.includes('instalacion') || serviceType.includes('software');

    // Procesar partes utilizadas de forma segura
    let partesTexto = 'Sin partes registradas';
    if (ticketData.parts) {
      try {
        let partes = [];
        if (typeof ticketData.parts === 'string') {
          try {
            partes = JSON.parse(ticketData.parts);
          } catch {
            partesTexto = ticketData.parts;
          }
        } else if (Array.isArray(ticketData.parts)) {
          partes = ticketData.parts;
        }
        
        if (Array.isArray(partes) && partes.length > 0) {
          partesTexto = partes
            .map((p: any) => `${p.cantidad || 1} x ${p.nombre || p.descripcion || 'Parte no especificada'}`)
            .join('<br>');
        }
      } catch (e) {
        partesTexto = String(ticketData.parts || 'Sin partes registradas');
      }
    }

    // Formatear fechas de forma segura
    const fechaCreacion = new Date(ticketData.createdAt || Date.now()).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const fechaActual = new Date().toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    // Variables para reemplazar en el template
    const variables = {
      '{{TICKET_ID}}': ticketId,
      '{{USER_NOMBRES}}': primerNombre,
      '{{USER_APELLIDOS}}': apellidos,
      '{{USER_FULL_NAME}}': nombreCompleto,
      '{{USER_ID}}': ticketData.user?.id || ticketData.userId || 'No especificado',
      '{{USER_DEPARTMENT}}': ticketData.user?.department || 'No especificado',
      '{{EQUIPMENT_ID}}': ticketData.equipment?.id || ticketData.equipmentId || 'No especificado',
      '{{EQUIPMENT_ACTIVO_FIJO}}': ticketData.equipment?.activo_fijo || 'No asignado',
      '{{EQUIPMENT_TYPE}}': ticketData.equipment?.type || 'No especificado',
      '{{EQUIPMENT_BRAND}}': ticketData.equipment?.brand || 'No especificado',
      '{{EQUIPMENT_MODEL}}': ticketData.equipment?.model || 'No especificado',
      '{{EQUIPMENT_INVENTORY}}': ticketData.equipment?.serial || ticketData.equipment?.id || 'No especificado',
      '{{EQUIPMENT_PROCESSOR}}': ticketData.equipment?.processor || 'No especificado',
      '{{EQUIPMENT_RAM}}': ticketData.equipment?.ram || 'No especificado', 
      '{{EQUIPMENT_STORAGE}}': ticketData.equipment?.storage || 'No especificado',
      '{{EQUIPMENT_OS}}': ticketData.equipment?.os || 'No especificado',
      '{{EQUIPMENT_OTHER_SPECS}}': ticketData.equipment?.other_specs || 'Ninguna',
      '{{SERVICE_TYPE}}': ticketData.serviceType || 'No especificado',
      '{{PREVENTIVO_CHECK}}': isPreventivo ? '☑' : '☐',
      '{{CORRECTIVO_CHECK}}': isCorrectivo ? '☑' : '☐', 
      '{{INSTALACION_CHECK}}': isInstalacion ? '☑' : '☐',
      '{{PROBLEM_DESCRIPTION}}': ticketData.observations || 'Sin observaciones',
      '{{DIAGNOSTIC}}': ticketData.diagnostic || 'Pendiente de diagnóstico',
      '{{REPAIR_DESCRIPTION}}': ticketData.repair || 'Sin reparaciones registradas',
      '{{PARTS_USED}}': partesTexto,
      '{{FECHA}}': fechaActual,
      '{{CREATION_DATE}}': fechaCreacion,
      '{{CURRENT_DATE}}': fechaActual,
      '{{CURRENT_YEAR}}': new Date().getFullYear().toString()
    };

    // Aplicar todas las sustituciones
    Object.entries(variables).forEach(([key, value]) => {
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      htmlTemplate = htmlTemplate.replace(new RegExp(escapedKey, 'g'), value);
    });

    // Devolver HTML procesado para que el cliente lo imprima
    return new Response(htmlTemplate, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="reporte-${ticketId}.html"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('❌ Error generando reporte:', error);
    return NextResponse.json({ 
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}