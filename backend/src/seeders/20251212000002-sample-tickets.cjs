// Seeder para tickets de ejemplo
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // Obtener algunos usuarios y equipos existentes
    const users = await queryInterface.sequelize.query(
      "SELECT id, nombre_completo FROM users LIMIT 10;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const equipment = await queryInterface.sequelize.query(
      "SELECT id, name FROM equipment LIMIT 5;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) return; // No crear tickets si no hay usuarios

    const tickets = [
      {
        id: uuidv4(),
        ticket_number: 'SBDI/0001/2025',
        title: 'Computadora no enciende',
        description: 'La computadora de escritorio en el área de captura no enciende. Se revisó el cable de alimentación y parece estar bien.',
        status: 'nuevo',
        priority: 'media',
        service_type: 'correctivo',
        reported_by_id: users[0].id,
        assigned_to_id: users.length > 1 ? users[1].id : null,
        equipment_id: equipment.length > 0 ? equipment[0].id : null,
        diagnosis: null,
        solution: null,
        parts: null,
        notes: 'Usuario reportó que ayer funcionaba correctamente',
        assigned_at: null,
        started_at: null,
        resolved_at: null,
        estimated_hours: 2,
        actual_hours: null,
        cost: null,
        attachments: Sequelize.literal("ARRAY[]::text[]"),
        tags: Sequelize.literal("ARRAY['hardware','power']::text[]"),
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
        updated_at: now
      },
      {
        id: uuidv4(),
        ticket_number: 'SBDI/0002/2025',
        title: 'Impresora sin toner',
        description: 'La impresora HP en la oficina de administración se quedó sin toner negro.',
        status: 'en_proceso',
        priority: 'baja',
        service_type: 'preventivo',
        reported_by_id: users.length > 1 ? users[1].id : users[0].id,
        assigned_to_id: users.length > 2 ? users[2].id : null,
        equipment_id: equipment.length > 1 ? equipment[1].id : null,
        diagnosis: 'Toner agotado, requiere reemplazo',
        solution: null,
        parts: 'Toner HP CE285A',
        notes: 'Impresora modelo HP LaserJet Pro M182nw',
        assigned_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        started_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        resolved_at: null,
        estimated_hours: 0.5,
        actual_hours: null,
        cost: 1500.00,
        attachments: Sequelize.literal("ARRAY[]::text[]"),
        tags: Sequelize.literal("ARRAY['impresora','consumibles']::text[]"),
        created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        updated_at: now
      },
      {
        id: uuidv4(),
        ticket_number: 'SBDI/0003/2025',
        title: 'Instalación de software antivirus',
        description: 'Se requiere instalar antivirus en 5 computadoras del área de sistemas.',
        status: 'cerrado',
        priority: 'alta',
        service_type: 'instalacion',
        reported_by_id: users.length > 2 ? users[2].id : users[0].id,
        assigned_to_id: users.length > 3 ? users[3].id : null,
        equipment_id: null,
        diagnosis: 'Computadoras sin protección antivirus',
        solution: 'Instalado antivirus Bitdefender en todas las máquinas',
        parts: 'Licencias Bitdefender',
        notes: 'Se realizó instalación remota en todas las estaciones',
        assigned_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        started_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        resolved_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        estimated_hours: 4,
        actual_hours: 3.5,
        cost: 2500.00,
        attachments: Sequelize.literal("ARRAY[]::text[]"),
        tags: Sequelize.literal("ARRAY['software','seguridad']::text[]"),
        created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        updated_at: now
      },
      {
        id: uuidv4(),
        ticket_number: 'SBDI/0004/2025',
        title: 'Mantenimiento preventivo mensual',
        description: 'Realizar mantenimiento preventivo en servidores y estaciones de trabajo.',
        status: 'pendiente',
        priority: 'media',
        service_type: 'preventivo',
        reported_by_id: users.length > 3 ? users[3].id : users[0].id,
        assigned_to_id: users.length > 4 ? users[4].id : null,
        equipment_id: null,
        diagnosis: null,
        solution: null,
        parts: null,
        notes: 'Mantenimiento programado para fin de mes',
        assigned_at: null,
        started_at: null,
        resolved_at: null,
        estimated_hours: 8,
        actual_hours: null,
        cost: null,
        attachments: Sequelize.literal("ARRAY[]::text[]"),
        tags: Sequelize.literal("ARRAY['mantenimiento','preventivo']::text[]"),
        created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        updated_at: now
      },
      {
        id: uuidv4(),
        ticket_number: 'SBDI/0005/2025',
        title: 'Red lenta en área de captura',
        description: 'Los usuarios reportan que la conexión a internet es muy lenta en el área de captura de datos.',
        status: 'nuevo',
        priority: 'alta',
        service_type: 'correctivo',
        reported_by_id: users.length > 4 ? users[4].id : users[0].id,
        assigned_to_id: null,
        equipment_id: null,
        diagnosis: null,
        solution: null,
        parts: null,
        notes: 'Problema afecta a 8 usuarios simultáneamente',
        assigned_at: null,
        started_at: null,
        resolved_at: null,
        estimated_hours: 3,
        actual_hours: null,
        cost: null,
        attachments: Sequelize.literal("ARRAY[]::text[]"),
        tags: Sequelize.literal("ARRAY['red','internet']::text[]"),
        created_at: now,
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert('tickets', tickets, {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tickets', null, {});
  }
};