import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { sql, asc, desc } from 'drizzle-orm';
import { tickets } from '../../../lib/db/schema';
import { broadcastEvent } from '../events/route';

// GET /api/tickets -> list tickets
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q') || '';
    const status = url.searchParams.get('status') || '';
    const page = parseInt(url.searchParams.get('page') || '1', 10) || 1;
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10) || 10;
  const sortBy = url.searchParams.get('sortBy') || 'createdAt';
  const sortDir = (url.searchParams.get('sortDir') || 'desc').toLowerCase();

    let builder = db.select().from(tickets);

    if (q) {
      // simple search on observations
  builder = (builder as any).where(sql`${tickets.observations} LIKE ${`%${q}%`}`);
    }

    if (status) {
  builder = (builder as any).where(sql`${tickets.status} = ${status}`);
    }

    // Drizzle: build a separate count query with the same where conditions
    let countQuery = db.select({ count: sql`count(*)` }).from(tickets);
    if (q) {
  countQuery = (countQuery as any).where(sql`${tickets.observations} LIKE ${`%${q}%`}`);
    }
    if (status) {
  countQuery = (countQuery as any).where(sql`${tickets.status} = ${status}`);
    }
    const countRes = await countQuery;
    const total = Array.isArray(countRes) && countRes.length ? Number(Object.values(countRes[0])[0]) : 0;

    // Apply sorting (validate fields)
    const allowedSort: Record<string, any> = {
      id: tickets.id,
      userId: tickets.userId,
      equipmentId: tickets.equipmentId,
      serviceType: tickets.serviceType,
      status: tickets.status,
      createdAt: tickets.createdAt,
    };

    const sortCol = allowedSort[sortBy] || tickets.createdAt;
  const rows = await builder.orderBy(sortDir === 'asc' ? asc(sortCol) : desc(sortCol)).limit(pageSize).offset((page - 1) * pageSize);

    return NextResponse.json({ tickets: rows, total, page, pageSize });
  } catch (err) {
    return NextResponse.json({ message: 'Error reading tickets', error: String(err) }, { status: 500 });
  }
}

// POST /api/tickets -> create a ticket (basic fields)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, equipmentId, serviceType, observations, parts } = body || {};
    if (!userId || !equipmentId || !serviceType) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // --- New ID Generation Logic ---
    const year = 2025;
    const prefix = `SBDI`;
    // Find the last ticket for the current year
    const lastTicket = await db.select()
      .from(tickets)
      .where(sql`id LIKE ${prefix + '/%/' + year}`)
      .orderBy(desc(tickets.id))
      .limit(1);

    let nextNumber = 1;
    if (lastTicket.length > 0 && lastTicket[0].id) {
      const lastId = lastTicket[0].id;
      const lastNumberStr = lastId.split('/')[1];
      const lastNumber = parseInt(lastNumberStr, 10);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    const newId = `${prefix}/${String(nextNumber).padStart(4, '0')}/${year}`;
    // --- End of New ID Generation Logic ---

    // Guardar partes como JSON si es un array, o null si no se envía
    let partsJson = null;
    if (Array.isArray(parts)) {
      partsJson = JSON.stringify(parts);
    }

    const inserted = await db.insert(tickets).values({ 
      id: newId, // Use the new generated ID
      userId, 
      equipmentId, 
      serviceType, 
      observations,
      parts: partsJson
    }).returning();
    
    // 🚀 Crear notificación para técnicos y administradores inmediatamente
    try {
      const { notifications, users } = await import('../../../lib/db/schema');
      
      // Buscar técnicos y administradores
      const adminTechUsers = await db.select().from(users).where(
        sql`${users.role} = 'tecnico' OR ${users.role} = 'admin'`
      );
      console.log('👷‍♂️ Usuarios técnicos y admins para notificación:', adminTechUsers.map(u => ({ id: u.id, name: u.name, role: u.role })));
      
      // Obtener nombre del usuario que reportó
      const reportingUser = await db.select().from(users).where(sql`${users.id} = ${userId}`).limit(1);
      const userName = reportingUser.length > 0 ? (reportingUser[0].name || reportingUser[0].email || userId) : userId;
      
      // Crear notificación personalizada para cada admin/técnico
      for (const user of adminTechUsers) {
        const notif = {
          userId: user.id,
          message: `🎫 Nuevo Reporte: ${userName} reportó un problema en el equipo ${equipmentId}. Tipo: ${serviceType}. Ticket: ${newId}. Requiere atención.`,
          read: 0
        };
        await db.insert(notifications).values(notif);
        console.log('🔔 Notificación creada para:', notif.userId, notif.message);
      }
      
      // Enviar evento en tiempo real para admins y técnicos
      broadcastEvent({
        type: 'new-ticket-for-staff',
        data: { 
          ticket: inserted[0],
          forRoles: ['admin', 'technician', 'tecnico'],
          count: adminTechUsers.length,
          reportedBy: userName,
          equipmentId,
          serviceType
        },
        message: `🎫 Nuevo reporte: ${newId} reportado por ${userName}`
      });
      
      console.log(`✅ Notificaciones enviadas a ${adminTechUsers.length} administradores y técnicos`);
    } catch (eventError) {
      console.error('❌ Error creando notificaciones:', eventError);
    }
    
    return NextResponse.json({ ticket: inserted[0] });
  } catch (err) {
    return NextResponse.json({ message: 'Error creating ticket', error: String(err) }, { status: 500 });
  }
}
