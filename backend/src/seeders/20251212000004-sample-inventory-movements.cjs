// Seeder para movimientos de inventario de ejemplo
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // Obtener algunos usuarios e insumos existentes
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM users LIMIT 5;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const insumos = await queryInterface.sequelize.query(
      "SELECT id FROM insumos LIMIT 5;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!users || users.length === 0 || !insumos || insumos.length === 0) return;

    const movements = [
      {
        id: uuidv4(),
        insumo_id: insumos[0].id,
        user_id: users[0].id,
        quantity: -1,
        type: 'TICKET',
        reference_id: 'TKT-001',
        description: 'Uso en ticket de mantenimiento de impresora',
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        insumo_id: insumos[1].id,
        user_id: users[1].id,
        quantity: -2,
        type: 'MANUAL',
        reference_id: null,
        description: 'Entrega para mantenimiento de computadoras',
        created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        insumo_id: insumos[2].id,
        user_id: users[2].id,
        quantity: 5,
        type: 'INITIAL',
        reference_id: null,
        description: 'Inventario inicial del sistema',
        created_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        insumo_id: insumos[3].id,
        user_id: users[0].id,
        quantity: -3,
        type: 'ADJUSTMENT',
        reference_id: null,
        description: 'Ajuste de inventario - pérdida',
        created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        insumo_id: insumos[4].id,
        user_id: users[3].id,
        quantity: 10,
        type: 'MANUAL',
        reference_id: null,
        description: 'Reabastecimiento de stock',
        created_at: now,
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert('inventory_movements', movements, {
      ignoreDuplicates: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Eliminar solo los registros creados por este seeder (ids fijos)
    const ids = [
      '00000000-0000-0000-0000-000000000101',
      '00000000-0000-0000-0000-000000000102',
      '00000000-0000-0000-0000-000000000103',
      '00000000-0000-0000-0000-000000000104',
      '00000000-0000-0000-0000-000000000105'
    ];
    await queryInterface.bulkDelete('inventory_movements', { id: ids }, {});
  }
};