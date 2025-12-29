import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { notifications } from '../../../../lib/db/schema';

// POST /api/notifications/create - Crear nuevas notificaciones
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, userId, userIds } = body;

    if (!message) {
      return NextResponse.json({ ok: false, message: 'message requerido' }, { status: 400 });
    }

    const results = [];
    
    // Si se proporciona un solo userId
    if (userId) {
      const notification = await db.insert(notifications).values({
        userId: userId,
        message: message,
        read: 0
      }).returning();
      results.push(notification[0]);
    }
    
    // Si se proporciona un array de userIds
    if (userIds && Array.isArray(userIds)) {
      for (const uid of userIds) {
        const notification = await db.insert(notifications).values({
          userId: uid,
          message: message,
          read: 0
        }).returning();
        results.push(notification[0]);
      }
    }

    return NextResponse.json({ 
      ok: true, 
      message: 'Notificaciones creadas exitosamente',
      notifications: results
    });

  } catch (error) {
    console.error('Error en POST /api/notifications/create:', error);
    return NextResponse.json({ ok: false, message: 'Error interno del servidor' }, { status: 500 });
  }
}