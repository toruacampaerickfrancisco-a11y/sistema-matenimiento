import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { tickets } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 });

    await db.delete(tickets).where(eq(tickets.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: 'Error deleting ticket', error: String(err) }, { status: 500 });
  }
}
