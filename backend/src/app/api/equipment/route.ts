export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { activo_fijo, type, brand, model, serial, processor, ram, storage, os, other_specs, userId } = body || {};
    if (!type || !serial) {
      return NextResponse.json({ ok: false, message: 'Faltan campos obligatorios (type, serial)' }, { status: 400 });
    }
    // Verificar si ya existe un equipo con el mismo serial
    const existing = await db.select().from(equipment).where(equipment.serial.eq(serial));
    if (existing.length > 0) {
      return NextResponse.json({ ok: false, message: 'El equipo ya existe' }, { status: 409 });
    }
    const [newEquipment] = await db.insert(equipment).values({
      activo_fijo,
      type,
      brand,
      model,
      serial,
      processor,
      ram,
      storage,
      os,
      other_specs,
      userId,
      createdAt: Math.floor(Date.now() / 1000)
    }).returning();
    return NextResponse.json({ ok: true, equipment: newEquipment, message: 'Equipo creado' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, message: 'Error al crear equipo', error: String(err) }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { equipment } from '../../../lib/db/schema';

export async function GET() {
  try {
    const rows = await db.select().from(equipment).orderBy(equipment.createdAt);
    // No mapear, usar user_id directamente
    return NextResponse.json({ equipment: rows });
  } catch (err) {
    return NextResponse.json({ message: 'Error reading equipment', error: String(err) }, { status: 500 });
  }
}
