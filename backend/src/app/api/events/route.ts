// API para eventos en tiempo real usando Server-Sent Events (SSE)
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { tickets, users, equipment, notifications } from '../../../lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// Mantener conexiones activas
const connections = new Map<string, ReadableStreamDefaultController>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return new NextResponse('User ID required', { status: 400 });
  }

  // Crear stream para eventos en tiempo real
  const stream = new ReadableStream({
    start(controller) {
      // Almacenar la conexión
      connections.set(userId, controller);
      
      // Enviar evento inicial de conexión
      const initEvent = `data: ${JSON.stringify({
        type: 'connected',
        timestamp: new Date().toISOString(),
        message: 'Conectado a actualizaciones en tiempo real'
      })}\n\n`;
      
      controller.enqueue(new TextEncoder().encode(initEvent));

      // Configurar envío de keep-alive cada 20 segundos (más estable)
      const keepAlive = setInterval(() => {
        try {
          const keepAliveEvent = `data: ${JSON.stringify({
            type: 'ping',
            timestamp: new Date().toISOString()
          })}\n\n`;
          controller.enqueue(new TextEncoder().encode(keepAliveEvent));
        } catch (error) {
          clearInterval(keepAlive);
          connections.delete(userId);
        }
      }, 20000);

      // Limpiar al cerrar la conexión
      return () => {
        clearInterval(keepAlive);
        connections.delete(userId);
      };
    },
    cancel() {
      connections.delete(userId);
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Función para enviar eventos a todos los clientes conectados
export function broadcastEvent(eventData: any) {
  const event = `data: ${JSON.stringify({
    ...eventData,
    timestamp: new Date().toISOString()
  })}\n\n`;

  connections.forEach((controller, userId) => {
    try {
      controller.enqueue(new TextEncoder().encode(event));
    } catch (error) {
      console.log(`Removing disconnected client: ${userId}`);
      connections.delete(userId);
    }
  });
}

// Función para enviar evento a usuario específico
export function sendEventToUser(userId: string, eventData: any) {
  const controller = connections.get(userId);
  if (controller) {
    try {
      const event = `data: ${JSON.stringify({
        ...eventData,
        timestamp: new Date().toISOString()
      })}\n\n`;
      controller.enqueue(new TextEncoder().encode(event));
    } catch (error) {
      connections.delete(userId);
    }
  }
}

// API POST para obtener datos actualizados
export async function POST(request: NextRequest) {
  try {
    const { type, userId } = await request.json();

    switch (type) {
      case 'get-tickets': {
        const ticketsData = await db.query.tickets.findMany({
          with: {
            user: true,
            equipment: true,
          },
          orderBy: [desc(tickets.createdAt)],
        });
        return NextResponse.json({ success: true, data: ticketsData });
      }

      case 'get-users': {
        const usersData = await db.select().from(users);
        return NextResponse.json({ success: true, data: usersData });
      }

      case 'get-equipment': {
        const equipmentData = await db.select().from(equipment);
        return NextResponse.json({ success: true, data: equipmentData });
      }

      case 'get-notifications': {
        if (!userId) {
          return NextResponse.json({ success: false, error: 'User ID required' });
        }
        const notificationsData = await db.select()
          .from(notifications)
          .where(eq(notifications.userId, userId))
          .orderBy(desc(notifications.createdAt));
        return NextResponse.json({ success: true, data: notificationsData });
      }

      default:
        return NextResponse.json({ success: false, error: 'Invalid type' });
    }
  } catch (error) {
    console.error('Error in events API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' });
  }
}