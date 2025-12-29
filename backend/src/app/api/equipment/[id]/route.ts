import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { equipment } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    const body = await req.json().catch(() => ({}));
    const allowed = ['type', 'brand', 'model', 'serial', 'userId'];
    const updateObj: Record<string, any> = {};
    for (const k of allowed) {
      if (body[k] !== undefined) {
        // Map userId to user_id for DB
        if (k === 'userId') {
          updateObj['user_id'] = body[k];
        } else {
          updateObj[k] = body[k];
        }
      }
    }

    if (Object.keys(updateObj).length === 0) {
      return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    await db.update(equipment).set(updateObj).where(eq(equipment.id, id));
    const updated = await db.select().from(equipment).where(eq(equipment.id, id)).limit(1);
    return NextResponse.json({ equipment: updated[0] || null });
  } catch (err) {
    return NextResponse.json({ message: 'Error updating equipment', error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    await db.delete(equipment).where(eq(equipment.id, id));
    return NextResponse.json({ deleted: true });
  } catch (err) {
    return NextResponse.json({ message: 'Error deleting equipment', error: String(err) }, { status: 500 });
  }
}
