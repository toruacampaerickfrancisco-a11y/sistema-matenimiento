import { Permission } from '../models/index.js';

const permisos = [
  // Dashboard
  { name: 'Ver dashboard', module: 'dashboard', action: 'view', description: 'Acceso al dashboard principal' },
  // Usuarios
  { name: 'Ver usuarios', module: 'users', action: 'view', description: 'Puede ver la lista de usuarios' },
  { name: 'Crear usuario', module: 'users', action: 'create', description: 'Puede crear nuevos usuarios' },
  { name: 'Editar usuario', module: 'users', action: 'edit', description: 'Puede editar usuarios existentes' },
  { name: 'Eliminar usuario', module: 'users', action: 'delete', description: 'Puede eliminar usuarios' },
  { name: 'Asignar permisos', module: 'users', action: 'assign', description: 'Puede asignar permisos a usuarios' },
  // Equipos
  { name: 'Ver equipos', module: 'equipment', action: 'view', description: 'Puede ver la lista de equipos' },
  { name: 'Crear equipo', module: 'equipment', action: 'create', description: 'Puede crear nuevos equipos' },
  { name: 'Editar equipo', module: 'equipment', action: 'edit', description: 'Puede editar equipos existentes' },
  { name: 'Eliminar equipo', module: 'equipment', action: 'delete', description: 'Puede eliminar equipos' },
  // Tickets
  { name: 'Ver tickets', module: 'tickets', action: 'view', description: 'Puede ver la lista de tickets' },
  { name: 'Crear ticket', module: 'tickets', action: 'create', description: 'Puede crear nuevos tickets' },
  { name: 'Editar ticket', module: 'tickets', action: 'edit', description: 'Puede editar tickets existentes' },
  { name: 'Eliminar ticket', module: 'tickets', action: 'delete', description: 'Puede eliminar tickets' },
  // Reportes
  { name: 'Ver reportes', module: 'reports', action: 'view', description: 'Puede ver reportes del sistema' },
  { name: 'Exportar reportes', module: 'reports', action: 'export', description: 'Puede exportar reportes' },
  // Perfil
  { name: 'Ver perfil', module: 'profile', action: 'view', description: 'Puede ver su perfil' },
  { name: 'Editar perfil', module: 'profile', action: 'edit', description: 'Puede editar su perfil' },
  // Permisos
  { name: 'Ver permisos', module: 'permissions', action: 'view', description: 'Puede ver la lista de permisos' },
  { name: 'Asignar permisos', module: 'permissions', action: 'assign', description: 'Puede asignar permisos a otros usuarios' },
];

async function cargarPermisos() {
  try {
    let creados = 0;
    for (const permiso of permisos) {
      const [perm, created] = await Permission.findOrCreate({
        where: { module: permiso.module, action: permiso.action },
        defaults: permiso
      });
      if (created) creados++;
    }
    console.log(`Permisos básicos cargados: ${creados}`);
    process.exit(0);
  } catch (err) {
    console.error('Error cargando permisos:', err);
    process.exit(1);
  }
}

cargarPermisos();