import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { users, equipment, tickets } from '../../../../lib/db/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const usersCount = await db.select({ count: sql`count(*)` }).from(users).execute();
    const eqCount = await db.select({ count: sql`count(*)` }).from(equipment).execute();
    const ticketsCount = await db.select({ count: sql`count(*)` }).from(tickets).execute();

    const sampleUsers = await db.select().from(users).limit(5);
    const sampleEquip = await db.select().from(equipment).limit(5);
    const sampleTickets = await db.select().from(tickets).limit(5);

    return NextResponse.json({
      counts: {
        users: Number((usersCount as any)[0]?.count || 0),
        equipment: Number((eqCount as any)[0]?.count || 0),
        tickets: Number((ticketsCount as any)[0]?.count || 0),
      },
      samples: {
        users: sampleUsers,
        equipment: sampleEquip,
        tickets: sampleTickets,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
