'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { v4: uuidv4 } = await import('uuid');

    // 1. Define Role Permissions Map (Copied from UserController)
    const rolePermissions = {
      'admin': 'ALL',
      'tecnico': [
        { module: 'dashboard', actions: ['view'] },
        { module: 'profile', actions: ['view', 'edit'] },
        { module: 'tickets', actions: ['view', 'create', 'edit'] },
        { module: 'equipment', actions: ['view', 'create', 'edit'] },
        { module: 'supplies', actions: ['view', 'create', 'edit'] },
        { module: 'users', actions: ['view'] },
        { module: 'reports', actions: ['view', 'export'] }
      ],
      'inventario': [
        { module: 'dashboard', actions: ['view'] },
        { module: 'profile', actions: ['view', 'edit'] },
        { module: 'equipment', actions: ['view', 'create', 'edit', 'delete'] },
        { module: 'supplies', actions: ['view', 'create', 'edit', 'delete'] },
        { module: 'tickets', actions: ['view'] }
      ],
      'usuario': [
        { module: 'dashboard', actions: ['view'] },
        { module: 'profile', actions: ['view', 'edit'] },
        { module: 'tickets', actions: ['view', 'create'] }
      ],
      'user': [
        { module: 'dashboard', actions: ['view'] },
        { module: 'profile', actions: ['view', 'edit'] },
        { module: 'tickets', actions: ['view', 'create'] }
      ]
    };

    // 2. Fetch Users and Permissions
    // Note: Using raw queries to avoid model dependency issues in migrations
    const [users] = await queryInterface.sequelize.query(
      'SELECT id, rol, usuario FROM users WHERE activo = true'
    );
    
    const [permissions] = await queryInterface.sequelize.query(
      'SELECT id, module, action FROM permissions'
    );

    if (!users.length || !permissions.length) {
      console.log('No users or permissions found. Skipping migration.');
      return;
    }

    const permissionsToInsert = [];
    const now = new Date();

    // 3. Iterate Users
    for (const user of users) {
      const normalizedRole = (user.rol || '')
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const targetPermissions = rolePermissions[normalizedRole] || rolePermissions['usuario'];
      
      let permissionsToGrant = [];

      if (targetPermissions === 'ALL') {
        permissionsToGrant = permissions;
      } else {
        permissionsToGrant = permissions.filter(perm => {
          return targetPermissions.some(p => 
            p.module === perm.module && p.actions.includes(perm.action)
          );
        });
      }

      // 4. Check existing permissions for this user
      const [existingUserPerms] = await queryInterface.sequelize.query(
        `SELECT permission_id FROM user_permissions WHERE user_id = '${user.id}'`
      );
      const existingPermIds = new Set(existingUserPerms.map(p => p.permission_id));

      for (const perm of permissionsToGrant) {
        if (!existingPermIds.has(perm.id)) {
          permissionsToInsert.push({
            id: uuidv4(),
            user_id: user.id,
            permission_id: perm.id,
            granted_by_id: user.id, // Self-granted as fallback
            granted_at: now,
            is_active: true,
            created_at: now,
            updated_at: now
          });
        }
      }
    }

    // 5. Bulk Insert
    if (permissionsToInsert.length > 0) {
      console.log(`Inserting ${permissionsToInsert.length} missing permissions...`);
      await queryInterface.bulkInsert('user_permissions', permissionsToInsert);
    } else {
      console.log('No missing permissions found.');
    }
  },

  async down (queryInterface, Sequelize) {
    // No safe revert for this data fix as we can't distinguish 
    // between permissions added by this migration and manual ones.
    console.log('Revert not implemented for data fix migration.');
  }
};
