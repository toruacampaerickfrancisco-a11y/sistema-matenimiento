import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;
  const fileName = data.get('fileName') as string;

  if (!file || !fileName) {
    return NextResponse.json({ success: false, message: 'No se encontró el archivo o el nombre.' }, { status: 400 });
  }

  // Validar que el nombre de archivo sea uno de los permitidos para evitar escrituras arbitrarias.
  const allowedFileNames = ['banner-custom.png', 'login-bg-custom.jpg'];
  if (!allowedFileNames.includes(fileName)) {
    return NextResponse.json({ success: false, message: 'Nombre de archivo no permitido.' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // La ruta donde se guardará el archivo.
  const filePath = path.join(process.cwd(), 'public', 'images', fileName);

  try {
    await writeFile(filePath, buffer);
    return NextResponse.json({ success: true, path: `/images/${fileName}` });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error al guardar el archivo.' }, { status: 500 });
  }
}