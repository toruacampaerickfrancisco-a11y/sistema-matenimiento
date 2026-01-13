// Seeder para permisos completos
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const permissions = [
      // Dashboard
      {
        id: uuidv4(),
        name: 'dashboard:view',
        module: 'dashboard',
        action: 'view',
        description: 'Permite ver en el módulo dashboard',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'dashboard:create',
        module: 'dashboard',
        action: 'create',
        description: 'Permite create en el módulo dashboard',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'dashboard:edit',
        module: 'dashboard',
        action: 'edit',
        description: 'Permite edit en el módulo dashboard',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'dashboard:delete',
        module: 'dashboard',
        action: 'delete',
        description: 'Permite delete en el módulo dashboard',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'dashboard:export',
        module: 'dashboard',
        action: 'export',
        description: 'Permite export en el módulo dashboard',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      // Users
      {
        id: uuidv4(),
        name: 'users:view',
        module: 'users',
        action: 'view',
        description: 'Permite ver usuarios',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'users:create',
        module: 'users',
        action: 'create',
        description: 'Permite crear usuarios',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'users:edit',
        module: 'users',
        action: 'edit',
        description: 'Permite editar usuarios',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'users:delete',
        module: 'users',
        action: 'delete',
        description: 'Permite eliminar usuarios',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      // Equipment
      {
        id: uuidv4(),
        name: 'equipment:view',
        module: 'equipment',
        action: 'view',
        description: 'Permite ver equipos',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'equipment:create',
        module: 'equipment',
        action: 'create',
        description: 'Permite crear equipos',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'equipment:edit',
        module: 'equipment',
        action: 'edit',
        description: 'Permite editar equipos',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'equipment:delete',
        module: 'equipment',
        action: 'delete',
        description: 'Permite eliminar equipos',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      // Tickets
      {
        id: uuidv4(),
        name: 'tickets:view',
        module: 'tickets',
        action: 'view',
        description: 'Permite ver tickets',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'tickets:create',
        module: 'tickets',
        action: 'create',
        description: 'Permite crear tickets',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'tickets:edit',
        module: 'tickets',
        action: 'edit',
        description: 'Permite editar tickets',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'tickets:delete',
        module: 'tickets',
        action: 'delete',
        description: 'Permite eliminar tickets',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      // Reports
      {
        id: uuidv4(),
        name: 'reports:view',
        module: 'reports',
        action: 'view',
        description: 'Permite ver reportes',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'reports:export',
        module: 'reports',
        action: 'export',
        description: 'Permite exportar reportes',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      // Profile
      {
        id: uuidv4(),
        name: 'profile:view',
        module: 'profile',
        action: 'view',
        description: 'Permite ver perfil',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'profile:edit',
        module: 'profile',
        action: 'edit',
        description: 'Permite editar perfil',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      // Permissions
      {
        id: uuidv4(),
        name: 'permissions:view',
        module: 'permissions',
        action: 'view',
        description: 'Permite ver permisos',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      // Supplies
      {
        id: uuidv4(),
        name: 'supplies:view',
        module: 'supplies',
        action: 'view',
        description: 'Permite ver insumos',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'supplies:create',
        module: 'supplies',
        action: 'create',
        description: 'Permite crear insumos',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'supplies:edit',
        module: 'supplies',
        action: 'edit',
        description: 'Permite editar insumos',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'supplies:delete',
        module: 'supplies',
        action: 'delete',
        description: 'Permite eliminar insumos',
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ];
    // await queryInterface.bulkDelete('permissions', null, {});
    await queryInterface.bulkInsert('permissions', permissions, {
      ignoreDuplicates: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};