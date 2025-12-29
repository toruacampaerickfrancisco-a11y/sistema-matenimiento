import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { users } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body || {};
    console.log('🔐 Intento de login:', { email, password: password ? '***' : 'vacío' });

    // Validación de entrada más específica
    if (!email || !password) {
      return NextResponse.json({ 
        ok: false, 
        message: 'Email y contraseña son requeridos' 
      }, { status: 400 });
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ 
        ok: false, 
        message: 'Formato de datos inválido' 
      }, { status: 400 });
    }

    // Normalizar email (lowercase y trim)
    const normalizedEmail = email.toLowerCase().trim();

    // Buscar usuario en la base de datos
    const userList = await db.select().from(users).where(eq(users.email, normalizedEmail));
    const user = userList[0];
    
    console.log('👤 Usuario encontrado:', user ? { id: user.id, name: user.name, role: user.role } : 'No encontrado');
    
    if (!user) {
      return NextResponse.json({ 
        ok: false, 
        message: 'Credenciales incorrectas' 
      }, { status: 401 });
    }

    // Validar contraseña: soportar hashes bcrypt (campo `contrasena`) o `passwordHash`
    const stored = user.contrasena || user.passwordHash || user.password || '';
    let isValid = false;
    if (typeof stored === 'string' && /^\$2[aby]\$/.test(stored)) {
      isValid = await bcrypt.compare(password, stored);
    } else {
      isValid = password === stored;
    }
    if (!isValid) {
      console.log('❌ Contraseña incorrecta para:', normalizedEmail);
      return NextResponse.json({ 
        ok: false, 
        message: 'Credenciales incorrectas' 
      }, { status: 401 });
    }

    console.log('✅ Login exitoso para:', user.name);

    // Retornar datos del usuario sin información sensible
    return NextResponse.json({ 
      ok: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      },
      message: 'Login exitoso'
    }, { status: 200 });
    
  } catch (err) {
    console.error('🔥 Error en login:', err);
    return NextResponse.json({ 
      ok: false, 
      message: 'Error interno del servidor' 
    }, { status: 500 });
  }
}
