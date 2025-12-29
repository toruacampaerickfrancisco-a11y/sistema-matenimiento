import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    message: 'Sistema de login funcionando correctamente',
    timestamp: new Date().toISOString(),
    routes: {
      login: '/api/auth/login',
      admin: '/admin', 
      user: '/user',
      tecnico: '/tecnico'
    }
  });
}