import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';
import { ticketHistory, users } from '../../../../../lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const ticketId = params.id;

  try {
    const history = await db.select({
      fieldChanged: ticketHistory.fieldChanged,
      oldValue: ticketHistory.oldValue,
      newValue: ticketHistory.newValue,
      createdAt: ticketHistory.createdAt,
      userName: users.name,
    }).from(ticketHistory).leftJoin(users, eq(ticketHistory.userId, users.id)).where(eq(ticketHistory.ticketId, ticketId)).orderBy(desc(ticketHistory.createdAt));

    return NextResponse.json({ history });
  } catch (err) {
    return NextResponse.json({ message: 'Error al obtener el historial', error: String(err) }, { status: 500 });
  }
}