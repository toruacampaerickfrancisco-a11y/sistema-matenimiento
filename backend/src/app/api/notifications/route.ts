import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { notifications } from '../../../lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';

// GET /api/notifications?userId=xxx
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ ok: false, message: 'userId requerido' }, { status: 400 });
  }
  
  // Obtener notificaciones ordenadas: NO leídas primero, luego por fecha (más recientes primero)
  const notifs = await db.select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(notifications.read, desc(notifications.createdAt));
    
  return NextResponse.json({ ok: true, notifications: notifs });
}

// POST /api/notifications - Para marcar como leída o eliminar
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, notificationId, userId } = body;

    if (!notificationId || !userId) {
      return NextResponse.json({ ok: false, message: 'notificationId y userId requeridos' }, { status: 400 });
    }

    if (action === 'markRead') {
      // Marcar como leída
      await db.update(notifications)
        .set({ read: 1 })
        .where(eq(notifications.id, notificationId));
        
      return NextResponse.json({ ok: true, message: 'Notificación marcada como leída' });
      
    } else if (action === 'delete') {
      // Eliminar notificación
      await db.delete(notifications)
        .where(eq(notifications.id, notificationId));
        
      return NextResponse.json({ ok: true, message: 'Notificación eliminada' });
      
    } else if (action === 'deleteAllRead') {
      // Eliminar todas las notificaciones leídas del usuario
      await db.delete(notifications)
        .where(and(
          eq(notifications.userId, userId),
          eq(notifications.read, 1)
        ));
        
      return NextResponse.json({ ok: true, message: 'Notificaciones leídas eliminadas' });
    }

    return NextResponse.json({ ok: false, message: 'Acción no válida' }, { status: 400 });
  } catch (error) {
    console.error('Error en POST /api/notifications:', error);
    return NextResponse.json({ ok: false, message: 'Error interno del servidor' }, { status: 500 });
  }
}
