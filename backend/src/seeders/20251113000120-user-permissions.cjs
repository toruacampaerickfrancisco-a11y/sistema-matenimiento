// Seeder para asignar todos los permisos al admin
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    // Obtener admin y permisos
    const [admin] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE usuario = 'admin' LIMIT 1;",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const permissions = await queryInterface.sequelize.query(
      "SELECT id FROM permissions;",
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (!admin || permissions.length === 0) return;
    const userPermissions = permissions.map(p => ({
      id: uuidv4(),
      user_id: admin.id,
      permission_id: p.id,
      granted_by_id: admin.id,
      granted_at: now,
      is_active: true,
      created_at: now,
      updated_at: now
    }));
    await queryInterface.bulkInsert('user_permissions', userPermissions, {
      ignoreDuplicates: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user_permissions', null, {});
  }
};
