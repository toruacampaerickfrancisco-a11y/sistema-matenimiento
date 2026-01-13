// Seeder para comentarios de tickets de ejemplo
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // Obtener algunos usuarios y tickets existentes
    const users = await queryInterface.sequelize.query(
      "SELECT id, nombre_completo FROM users LIMIT 5;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const tickets = await queryInterface.sequelize.query(
      "SELECT id FROM tickets LIMIT 3;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!users || users.length === 0 || !tickets || tickets.length === 0) return;

    const comments = [
      {
        id: uuidv4(),
        ticket_id: tickets[0].id,
        created_by_id: users[0].id,
        comment: 'He revisado la computadora y el problema parece ser con la fuente de poder. Voy a verificar el voltaje.',
        is_internal: false,
        created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        ticket_id: tickets[0].id,
        created_by_id: users[1].id,
        comment: 'Gracias por la actualización. ¿Cuánto tiempo tomará el reemplazo de la fuente?',
        is_internal: false,
        created_at: new Date(now.getTime() - 20 * 60 * 1000), // 20 minutos después
        updated_at: new Date(now.getTime() - 20 * 60 * 1000)
      },
      {
        id: uuidv4(),
        ticket_id: tickets[1].id,
        created_by_id: users[2].id,
        comment: 'Toner instalado correctamente. La impresora ya está funcionando.',
        is_internal: true,
        created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 horas atrás
        updated_at: new Date(now.getTime() - 2 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        ticket_id: tickets[2].id,
        created_by_id: users[3].id,
        comment: 'Instalación completada en todas las estaciones. Antivirus funcionando correctamente.',
        is_internal: true,
        created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        ticket_id: tickets[2].id,
        created_by_id: users[0].id,
        comment: 'Excelente trabajo. Los usuarios ya pueden trabajar con tranquilidad.',
        is_internal: false,
        created_at: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutos después
        updated_at: new Date(now.getTime() - 30 * 60 * 1000)
      }
    ];

    await queryInterface.bulkInsert('ticket_comments', comments, {
      ignoreDuplicates: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ticket_comments', null, {});
  }
};
