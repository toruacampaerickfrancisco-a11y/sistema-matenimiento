// Script para crear un usuario administrador manualmente
import { User } from '../../src/models/index.js';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  try {
    const admin = await User.create({
      numero_empleado: `ADMIN${Date.now()}`,
      usuario: 'admin',
      correo: 'admin@erp.local',
      contrasena: 'admin123',
      dependencia: 'Sistemas',
      departamento: 'Sistemas',
      rol: 'admin',
      cargo: 'Administrador General',
      area: 'Sistemas',
      creado_por: 'sistema',
      nombre_completo: 'Administrador General',
      activo: true
    });
    console.log('Usuario administrador creado:');
    console.log('Correo: admin@erp.local');
    console.log('Usuario: admin');
    console.log('Contraseña: admin123');
  } catch (err) {
    console.error('Error al crear usuario admin:', err.message);
  }
}

createAdmin().then(() => process.exit(0));