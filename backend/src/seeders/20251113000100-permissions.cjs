// Seeder para permisos mínimos
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const permissions = [
      {
        id: uuidv4(),
        name: 'Ver Dashboard',
        module: 'dashboard',
        action: 'view',
        description: 'Permite ver el dashboard principal',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'Ver Usuarios',
        module: 'users',
        action: 'view',
        description: 'Permite ver la lista de usuarios',
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ];
    await queryInterface.bulkDelete('permissions', null, {});
    await queryInterface.bulkInsert('permissions', permissions, {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
