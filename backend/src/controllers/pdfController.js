import PDFDocument from 'pdfkit';
import { Ticket, User, Equipment, Department } from '../models/index.js';
import fs from 'fs';
import path from 'path';

const pdfController = {
  async generateTicketPdf(ctx) {
    try {
      const { id } = ctx.params;
      const ticket = await Ticket.findByPk(id, {
        include: [
          { 
            model: User, 
            as: 'reportedBy', 
            attributes: ['nombre_completo', 'cargo', 'numero_empleado', 'departamento'],
            include: [{ model: Department, as: 'department', attributes: ['display_name'] }]
          },
          { model: User, as: 'assignedTo', attributes: ['nombre_completo'] },
          { model: Equipment, as: 'equipment', attributes: ['name', 'type', 'brand', 'model', 'serial_number', 'inventory_number', 'processor', 'ram', 'hard_drive', 'description'] }
        ]
      });

      if (!ticket) {
        ctx.status = 404;
        ctx.body = { success: false, message: 'Ticket no encontrado' };
        return;
      }

      // Check permissions (Admin and Technician only)
      const user = ctx.state.user;
      const role = (user.rol || user.role || '').toLowerCase().trim();
      
      if (!['admin', 'tecnico', 'technician'].includes(role)) {
        ctx.status = 403;
        ctx.body = { success: false, message: 'Acceso denegado. Solo administradores y técnicos pueden generar este documento.' };
        return;
      }

      const doc = new PDFDocument({ margin: 30, size: 'LETTER' });
      
      // Set response headers
      ctx.set('Content-Type', 'application/pdf');
      ctx.set('Content-Disposition', `attachment; filename=ticket-${ticket.ticket_number}.pdf`);
      ctx.status = 200;
      ctx.body = doc;

      // --- Helper Functions ---
      const drawBox = (x, y, w, h, fillColor = null) => {
        if (fillColor) {
          doc.rect(x, y, w, h).fillAndStroke(fillColor, '#000000');
        } else {
          doc.rect(x, y, w, h).stroke();
        }
      };

      const drawHeaderBox = (x, y, w, text) => {
        doc.rect(x, y, w, 15).fillAndStroke('#800040', '#000000'); // Magenta oscuro
        doc.fillColor('white').fontSize(9).font('Helvetica-Bold').text(text, x, y + 3, { width: w, align: 'center' });
        doc.fillColor('black').font('Helvetica'); // Reset
      };

      // --- Layout Constants ---
      const startX = 30;
      const startY = 60; // Ajustado para bajar el contenido y centrarlo mejor verticalmente
      const pageWidth = 550; // Letter width approx 612 - margins
      const colWidth = (pageWidth - 20) / 2; // Two columns with gap
      const col2X = startX + colWidth + 20;

      // --- Header ---
      // Logos placeholder (Left)
      const logoPath = path.join(process.cwd(), 'public', 'images', 'logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, startX, startY - 5, { width: 160 });
      }
      
      // Title (Right)
      doc.fontSize(14).font('Helvetica-Bold').text('REPORTE DE SERVICIO', 0, startY + 10, { align: 'right', width: pageWidth + 30 });

      // Report No & Date
      const headerInfoY = startY + 40;
      // No DE REPORTE
      drawHeaderBox(col2X, headerInfoY, 100, 'No DE REPORTE');
      doc.rect(col2X + 100, headerInfoY, colWidth - 100, 15).stroke();
      doc.fontSize(10).fillColor('black').text(ticket.ticket_number, col2X + 105, headerInfoY + 3);

      // FECHA
      const dateY = headerInfoY + 20;
      drawHeaderBox(col2X, dateY, 100, 'FECHA');
      doc.rect(col2X + 100, dateY, colWidth - 100, 15).stroke();
      
      let dateText = '';
      try {
        if (ticket.createdAt) {
          const dateObj = new Date(ticket.createdAt);
          if (!isNaN(dateObj.getTime())) {
             dateText = dateObj.toLocaleDateString('es-MX');
          }
        }
      } catch (e) {
        console.error('Error formatting date:', e);
      }
      doc.fontSize(10).text(dateText, col2X + 105, dateY + 3);

      let currentY = startY + 90;

      // --- Section 1: DATOS DE USUARIO (Left) ---
      drawHeaderBox(startX, currentY, colWidth, 'DATOS DE USUARIO');
      
      let lineY = currentY + 25;
      const lineHeight = 15;
      
      // Nombre
      doc.fontSize(8).font('Helvetica-Bold').text('NOMBRE(S):', startX + 5, lineY);
      doc.font('Helvetica').text(ticket.reportedBy?.nombre_completo || '', startX + 60, lineY);
      doc.moveTo(startX + 55, lineY + 10).lineTo(startX + colWidth - 5, lineY + 10).stroke();
      
      // Apellidos / No Empleado
      lineY += lineHeight;
      doc.font('Helvetica-Bold').text('NO. EMPLEADO:', startX + 5, lineY);
      doc.font('Helvetica').text(ticket.reportedBy?.numero_empleado || '', startX + 80, lineY);
      doc.moveTo(startX + 75, lineY + 10).lineTo(startX + colWidth - 5, lineY + 10).stroke();

      // Departamento
      lineY += lineHeight;
      doc.font('Helvetica-Bold').fontSize(8).text('DEPARTAMENTO:', startX + 5, lineY);
      const deptName = ticket.reportedBy?.department?.display_name || ticket.reportedBy?.departamento || '';
      
      // Ajustar tamaño de fuente si el texto es muy largo
      let deptFontSize = 8;
      doc.font('Helvetica').fontSize(deptFontSize);
      const maxDeptWidth = colWidth - 90; // Espacio disponible
      
      while (doc.widthOfString(deptName) > maxDeptWidth && deptFontSize > 4) {
        deptFontSize -= 0.5;
        doc.fontSize(deptFontSize);
      }
      
      // Centrar verticalmente si la fuente es más pequeña
      const yOffset = deptFontSize < 8 ? (8 - deptFontSize) / 2 : 0;
      
      doc.text(deptName, startX + 85, lineY + yOffset);
      doc.moveTo(startX + 80, lineY + 10).lineTo(startX + colWidth - 5, lineY + 10).stroke();


      // --- Section 2: OBSERVACIONES (Right) - Description ---
      drawHeaderBox(col2X, currentY, colWidth, 'DESCRIPCION DEL PROBLEMA');
      doc.rect(col2X, currentY + 15, colWidth, 70).stroke();
      doc.font('Helvetica').fontSize(9).text(ticket.description || '', col2X + 5, currentY + 20, { width: colWidth - 10 });

      currentY += 95;

      // --- Section 3: DATOS DEL EQUIPO (Left) ---
      drawHeaderBox(startX, currentY, colWidth, 'DATOS DEL EQUIPO');
      
      lineY = currentY + 25;
      
      // Tipo
      doc.font('Helvetica-Bold').text('TIPO:', startX + 5, lineY);
      const equipmentType = ticket.equipment?.type || '';
      doc.font('Helvetica').text(equipmentType.toUpperCase(), startX + 40, lineY);
      doc.moveTo(startX + 35, lineY + 10).lineTo(startX + colWidth - 5, lineY + 10).stroke();

      // Marca
      lineY += lineHeight;
      doc.font('Helvetica-Bold').text('MARCA:', startX + 5, lineY);
      doc.font('Helvetica').text(ticket.equipment?.brand || '', startX + 45, lineY);
      doc.moveTo(startX + 40, lineY + 10).lineTo(startX + colWidth - 5, lineY + 10).stroke();

      // Modelo
      lineY += lineHeight;
      doc.font('Helvetica-Bold').text('MODELO:', startX + 5, lineY);
      doc.font('Helvetica').text(ticket.equipment?.model || '', startX + 50, lineY);
      doc.moveTo(startX + 45, lineY + 10).lineTo(startX + colWidth - 5, lineY + 10).stroke();

      // Activo Fijo
      lineY += lineHeight;
      doc.font('Helvetica-Bold').text('ACTIVO FIJO:', startX + 5, lineY);
      doc.font('Helvetica').text(ticket.equipment?.inventory_number || '', startX + 85, lineY);
      doc.moveTo(startX + 80, lineY + 10).lineTo(startX + colWidth - 5, lineY + 10).stroke();


      // --- Section 4: CARACTERISTICAS DEL EQUIPO (Right) ---
      drawHeaderBox(col2X, currentY, colWidth, 'CARACTERISTICAS DEL EQUIPO');
      
      lineY = currentY + 25;
      
      // Procesador
      doc.font('Helvetica-Bold').text('PROCESADOR:', col2X + 5, lineY);
      doc.font('Helvetica').text(ticket.equipment?.processor || '', col2X + 75, lineY);
      doc.moveTo(col2X + 70, lineY + 10).lineTo(col2X + colWidth - 5, lineY + 10).stroke();

      // RAM
      lineY += lineHeight;
      doc.font('Helvetica-Bold').text('RAM:', col2X + 5, lineY);
      doc.font('Helvetica').text(ticket.equipment?.ram || '', col2X + 35, lineY);
      doc.moveTo(col2X + 30, lineY + 10).lineTo(col2X + colWidth - 5, lineY + 10).stroke();

      // Disco Duro
      lineY += lineHeight;
      doc.font('Helvetica-Bold').text('DISCO DURO:', col2X + 5, lineY);
      doc.font('Helvetica').text(ticket.equipment?.hard_drive || '', col2X + 70, lineY);
      doc.moveTo(col2X + 65, lineY + 10).lineTo(col2X + colWidth - 5, lineY + 10).stroke();

      currentY += 85;

      // --- Section 5: TIPO DE SERVICIO (Full Width) ---
      drawHeaderBox(startX, currentY, pageWidth, 'TIPO DE SERVICIO');
      
      lineY = currentY + 25;
      
      // Checkboxes
      const drawCheckbox = (x, y, label, checked) => {
        doc.rect(x, y, 10, 10).stroke();
        if (checked) {
          doc.font('Helvetica-Bold').text('X', x + 1, y + 1);
        }
        doc.font('Helvetica-Bold').text(label, x + 15, y + 1);
      };

      drawCheckbox(startX + 20, lineY, 'PREVENTIVO', ticket.service_type === 'preventivo');
      drawCheckbox(startX + 200, lineY, 'CORRECTIVO', ticket.service_type === 'correctivo');
      drawCheckbox(startX + 400, lineY, 'INSTALACION', ticket.service_type === 'instalacion');

      currentY += 45;

      // --- Section 6: DIAGNOSTICO TÉCNICO (Left) ---
      drawHeaderBox(startX, currentY, colWidth, 'DIAGNOSTICO TÉCNICO');
      doc.rect(startX, currentY + 15, colWidth, 80).stroke();
      doc.font('Helvetica').fontSize(9).text(ticket.diagnosis || '', startX + 5, currentY + 20, { width: colWidth - 10 });

      // --- Section 7: REPARACION REALIZADA (Right) ---
      drawHeaderBox(col2X, currentY, colWidth, 'REPARACION REALIZADA');
      doc.rect(col2X, currentY + 15, colWidth, 80).stroke();
      doc.font('Helvetica').fontSize(9).text(ticket.solution || '', col2X + 5, currentY + 20, { width: colWidth - 10 });

      currentY += 105;

      // --- Section 8: PARTES Y REFACCIONES REQUERIDAS (Left) ---
      drawHeaderBox(startX, currentY, colWidth, 'PARTES Y REFACCIONES REQUERIDAS');
      
      // Table Header
      const tableY = currentY + 15;
      doc.rect(startX, tableY, 40, 15).stroke(); // CANT
      doc.font('Helvetica-Bold').fontSize(8).text('CANT', startX, tableY + 4, { width: 40, align: 'center' });
      
      doc.rect(startX + 40, tableY, colWidth - 40, 15).stroke(); // DESCRIPCION
      doc.text('DESCRIPCIÓN', startX + 40, tableY + 4, { width: colWidth - 40, align: 'center' });

      // Table Rows
      let parts = ticket.parts || [];

      for (let i = 0; i < 4; i++) {
        const rowY = tableY + 15 + (i * 16);
        doc.rect(startX, rowY, 40, 16).stroke();
        doc.rect(startX + 40, rowY, colWidth - 40, 16).stroke();
        
        if (parts[i]) {
          doc.font('Helvetica').text(parts[i].quantity || parts[i].cantidad || '1', startX + 2, rowY + 4, { width: 36, align: 'center' });
          doc.text(parts[i].description || parts[i].name || parts[i].nombre || '', startX + 42, rowY + 4, { width: colWidth - 44 });
        }
      }

      // --- Section 9: OBSERVACIONES (Right) - Notes ---
      drawHeaderBox(col2X, currentY, colWidth, 'OBSERVACIONES');
      doc.rect(col2X, currentY + 15, colWidth, 80).stroke();
      
      doc.font('Helvetica').fontSize(9).text(ticket.notes || '', col2X + 5, currentY + 20, { width: colWidth - 10 });

      currentY += 120;

      // --- Signatures ---
      const signatureY = currentY + 40;
      
      // Technician Signature
      doc.moveTo(startX + 20, signatureY).lineTo(startX + 220, signatureY).stroke();
      doc.font('Helvetica-Bold').fontSize(9).text('Firma de Técnico', startX + 20, signatureY + 5, { width: 200, align: 'center' });
      doc.font('Helvetica').fontSize(8).text(ticket.assignedTo?.nombre_completo || '', startX + 20, signatureY + 20, { width: 200, align: 'center' });

      // User Signature
      doc.moveTo(col2X + 20, signatureY).lineTo(col2X + 220, signatureY).stroke();
      doc.font('Helvetica-Bold').fontSize(9).text('Firma de Usuario', col2X + 20, signatureY + 5, { width: 200, align: 'center' });
      doc.font('Helvetica').fontSize(8).text(ticket.reportedBy?.nombre_completo || '', col2X + 20, signatureY + 20, { width: 200, align: 'center' });

      doc.end();

    } catch (error) {
      console.error('Error generating PDF:', error);
      ctx.status = 500;
      ctx.body = { success: false, message: 'Error al generar el PDF' };
    }
  }
};

export default pdfController;
