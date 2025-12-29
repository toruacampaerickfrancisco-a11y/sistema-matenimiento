import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { users } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    const body = await req.json().catch(() => ({}));
    const allowed = ['name', 'email', 'department', 'role', 'passwordHash'];
    const updateObj: Record<string, any> = {};
    for (const k of allowed) if (body[k] !== undefined) updateObj[k] = body[k];

    if (Object.keys(updateObj).length === 0) {
      return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    await db.update(users).set(updateObj).where(eq(users.id, id));
    const updated = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return NextResponse.json({ user: updated[0] || null });
  } catch (err) {
    return NextResponse.json({ message: 'Error updating user', error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    await db.delete(users).where(eq(users.id, id));
    return NextResponse.json({ deleted: true });
  } catch (err) {
    return NextResponse.json({ message: 'Error deleting user', error: String(err) }, { status: 500 });
  }
}
