import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { tickets, users, notifications } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id: ticketId } = body;

    if (!ticketId) {
      return NextResponse.json({ message: 'Ticket ID es requerido' }, { status: 400 });
    }

    // 1. Obtener la información completa del ticket desde la BD
    const ticketData = await db.query.tickets.findFirst({
      where: eq(tickets.id, ticketId),
      with: {
        user: true, // Incluye datos del usuario relacionado
        equipment: true, // Incluye datos del equipo relacionado
      },
    });

    if (!ticketData) {
      return NextResponse.json({ message: 'Ticket no encontrado' }, { status: 404 });
    }

    // Generar documento Word válido usando 'docx'
    function formatDate(ts: any): string {
      if (!ts) return '';
      let d = typeof ts === 'number' ? new Date(ts * 1000) : new Date(ts);
      return d.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }
    let partsArray = [];
    if (ticketData.parts) {
      try {
        if (typeof ticketData.parts === 'string') {
          partsArray = JSON.parse(ticketData.parts);
        } else if (Array.isArray(ticketData.parts)) {
          partsArray = ticketData.parts;
        }
      } catch (e) { partsArray = []; }
    }
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440,
                right: 1440, 
                bottom: 1440,
                left: 1440,
              },
            },
          },

          children: [
            // TÍTULO PRINCIPAL
            new Paragraph({
              children: [new TextRun({ 
                text: 'REPORTE DE SERVICIO DE MANTENIMIENTO', 
                bold: true, 
                size: 32,
                color: "7B1343"
              })],
              spacing: { after: 300 },
              alignment: AlignmentType.CENTER,
            }),
            
            // Información básica
            new Paragraph({
              children: [
                new TextRun({ text: 'No. Folio: ', bold: true }),
                new TextRun({ text: ticketData.id, bold: true, color: "7B1343" }),
                new TextRun({ text: ' | Fecha: ', bold: true }),
                new TextRun({ text: formatDate(ticketData.createdAt) }),
              ],
              spacing: { after: 250 },
              alignment: AlignmentType.CENTER,
            }),

            // DATOS DEL SOLICITANTE
            new Paragraph({
              children: [new TextRun({ text: 'I. DATOS DEL SOLICITANTE', bold: true, size: 26, color: "99004D" })],
              spacing: { after: 150 },
            }),
            new Paragraph(`• Nombre: ${ticketData.user?.name || 'No especificado'}`),
            new Paragraph(`• ID Usuario: ${ticketData.user?.id || ticketData.userId}`),
            new Paragraph(`• Email: ${ticketData.user?.email || 'No especificado'}`),
            new Paragraph(`• Departamento: ${ticketData.user?.department || 'No especificado'}`),
            new Paragraph({ text: "", spacing: { after: 200 } }),

            // DATOS DEL EQUIPO  
            new Paragraph({
              children: [new TextRun({ text: 'II. DATOS DEL EQUIPO', bold: true, size: 26, color: "99004D" })],
              spacing: { after: 150 },
            }),
            new Paragraph(`• Tipo: ${ticketData.equipment?.type || 'No especificado'}`),
            new Paragraph(`• ID Equipo: ${ticketData.equipment?.id || ticketData.equipmentId}`),
            new Paragraph(`• Marca: ${ticketData.equipment?.brand || 'No especificada'}`),
            new Paragraph(`• Modelo: ${ticketData.equipment?.model || 'No especificado'}`),
            new Paragraph(`• Serie: ${ticketData.equipment?.serial || 'No especificada'}`),
            new Paragraph({ text: "", spacing: { after: 200 } }),

            // DETALLES DEL SERVICIO
            new Paragraph({
              children: [new TextRun({ text: 'III. DETALLES DEL SERVICIO', bold: true, size: 26, color: "99004D" })],
              spacing: { after: 150 },
            }),
            new Paragraph(`• Tipo de Servicio: ${ticketData.serviceType}`),
            new Paragraph(`• Estado: ${ticketData.status}`),
            new Paragraph({ text: "", spacing: { after: 150 } }),
            
            new Paragraph({
              children: [new TextRun({ text: 'Descripción del Problema:', bold: true })],
              spacing: { after: 100 },
            }),
            new Paragraph(ticketData.observations || 'No especificado'),
            new Paragraph({ text: "", spacing: { after: 200 } }),

            // DIAGNÓSTICO (si existe)
            ...(ticketData.diagnostic ? [
              new Paragraph({
                children: [new TextRun({ text: 'IV. DIAGNÓSTICO TÉCNICO', bold: true, size: 26, color: "99004D" })],
                spacing: { after: 150 },
              }),
              new Paragraph(ticketData.diagnostic),
              new Paragraph({ text: "", spacing: { after: 200 } }),
            ] : []),

            // TRABAJOS REALIZADOS (si existe)
            ...(ticketData.repair ? [
              new Paragraph({
                children: [new TextRun({ text: 'V. TRABAJOS REALIZADOS', bold: true, size: 26, color: "99004D" })],
                spacing: { after: 150 },
              }),
              new Paragraph(ticketData.repair),
              new Paragraph({ text: "", spacing: { after: 200 } }),
            ] : []),

            // PARTES (si existen)
            ...(partsArray.length > 0 ? [
              new Paragraph({
                children: [new TextRun({ text: 'VI. PARTES UTILIZADAS', bold: true, size: 26, color: "99004D" })],
                spacing: { after: 150 },
              }),
              ...partsArray.map((p: any) => 
                new Paragraph(`• ${p.nombre || p.name}: ${p.cantidad || '1'} unidad(es)`)
              ),
              new Paragraph({ text: "", spacing: { after: 300 } }),
            ] : []),

            // FIRMAS
            new Paragraph({
              children: [new TextRun({ text: 'VALIDACIONES', bold: true, size: 24, color: "99004D" })],
              spacing: { after: 400 },
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [new TextRun({ text: '_________________________                    _________________________' })],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [new TextRun({ text: '     Técnico Responsable                           Usuario Solicitante     ', bold: true })],
              alignment: AlignmentType.CENTER,
            }),
          ],
        },
      ],
    });
    const buffer = await Packer.toBuffer(doc);
    
    // 🔔 CREAR NOTIFICACIONES DESPUÉS DE GENERAR EL REPORTE
    try {
      // Importar función de eventos
      const { broadcastEvent } = await import('../../events/route');
      
      // Obtener administradores y técnicos para notificar
      const adminUsers = await db.select().from(users).where(eq(users.role, 'admin'));
      const tecnicoUsers = await db.select().from(users).where(eq(users.role, 'tecnico'));
      
      const reportMessage = `📊 Nuevo reporte generado para el ticket #${ticketData.id} - ${ticketData.serviceType}`;
      const allUsersToNotify = [...adminUsers, ...tecnicoUsers];
      
      // Crear notificaciones para todos los usuarios admin y técnicos
      for (const user of allUsersToNotify) {
        await db.insert(notifications).values({
          userId: user.id,
          message: reportMessage,
          createdAt: new Date().toISOString(),
          read: 0,
        });
      }
      
      // 🚀 Enviar evento en tiempo real
      broadcastEvent({
        type: 'report-generated',
        data: { ticketId, serviceType: ticketData.serviceType },
        message: reportMessage
      });
      
      console.log(`✅ Notificaciones y eventos enviados a ${allUsersToNotify.length} usuarios sobre reporte ${ticketId}`);
    } catch (notificationError) {
      console.error('❌ Error enviando notificaciones:', notificationError);
    }
    
    const uint8Array = new Uint8Array(buffer);
    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename=reporte-${ticketId}.docx`,
      },
    });
  } catch (error) {
    console.error('Error generando el reporte:', error);
    const err = error as Error;
    return NextResponse.json({ message: 'Error interno del servidor', error: err.message }, { status: 500 });
  }
}
