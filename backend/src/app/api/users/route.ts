export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, password, department, role } = body || {};
    if (!name || !email || !password || !department || !role) {
      return NextResponse.json({ ok: false, message: 'Faltan campos obligatorios' }, { status: 400 });
    }
    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim();
    // Verificar si ya existe
    const existing = await db.select().from(users).where(eq(users.email, normalizedEmail));
    if (existing.length > 0) {
      return NextResponse.json({ ok: false, message: 'El usuario ya existe' }, { status: 409 });
    }
    // Insertar usuario (contraseña en texto plano, puedes mejorar esto luego)
    const insertData: any = {
      name,
      email: normalizedEmail,
      passwordHash: password,
      department,
      role
      // createdAt: omitido para usar el default de la base de datos
    };
    if (id && typeof id === 'string' && id.trim().length > 0) {
      insertData.id = id.trim();
    }
    const [newUser] = await db.insert(users).values(insertData).returning();
    // Opcional: emitir evento
    try { broadcastEvent && broadcastEvent('user_created', { id: newUser.id, name }); } catch(_) {}
    return NextResponse.json({ ok: true, user: newUser, message: 'Usuario creado' }, { status: 201 });
  } catch (err) {
    console.error('🔥 Error detallado al crear usuario:', err);
    return NextResponse.json({ ok: false, message: 'Error al crear usuario', error: String(err) }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { users } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { broadcastEvent } from '../events/route';

export async function GET() {
  try {
    const rows = await db.select().from(users).orderBy(users.createdAt);
    try { console.log('[api/users] fetched rows:', Array.isArray(rows) ? rows.length : 'unknown'); } catch(_) {}
    return NextResponse.json({ users: rows });
  } catch (err) {
    return NextResponse.json({ message: 'Error reading users', error: String(err) }, { status: 500 });
  }
}
