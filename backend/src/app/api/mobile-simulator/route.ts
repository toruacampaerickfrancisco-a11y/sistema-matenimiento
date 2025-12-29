import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const htmlPath = join(process.cwd(), 'mobile-simulator.html');
    const htmlContent = readFileSync(htmlPath, 'utf-8');
    
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Simulador no encontrado' }, { status: 404 });
  }
}