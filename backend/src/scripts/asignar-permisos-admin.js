import { User, Permission, UserPermission } from '../models/index.js';
import sequelize from '../config/database.js';

async function asignarPermisosAdmin() {
  try {
    // Buscar usuario admin por correo
    const admin = await User.findOne({ where: { correo: 'admin@sedesson.gob.mx' } });
    if (!admin) {
      console.error('No se encontró el usuario admin.');
      process.exit(1);
    }

    // Obtener todos los permisos
    const permisos = await Permission.findAll();
    if (!permisos.length) {
      console.error('No hay permisos definidos en la tabla permissions.');
      process.exit(1);
    }

    let asignados = 0;
    for (const permiso of permisos) {
      // Verificar si ya tiene el permiso
      const existe = await UserPermission.findOne({
        where: { user_id: admin.id, permission_id: permiso.id }
      });
      if (!existe) {
        await UserPermission.create({
          user_id: admin.id,
          permission_id: permiso.id,
          granted_by_id: admin.id, // El mismo admin se auto-otorga
          is_active: true,
          granted_at: new Date()
        });
        asignados++;
      }
    }
    console.log(`Permisos asignados al admin: ${asignados}`);
    process.exit(0);
  } catch (err) {
    console.error('Error asignando permisos al admin:', err);
    process.exit(1);
  }
}

asignarPermisosAdmin();