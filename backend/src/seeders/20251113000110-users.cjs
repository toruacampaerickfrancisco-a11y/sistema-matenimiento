// Seeder para usuarios mínimos
'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const adminId = uuidv4();
    const users = [
      {
        id: adminId,
        usuario: 'admin',
        correo: 'admin@bienestar.sonora.gob.mx',
        contrasena: await bcrypt.hash('admin123', 10),
        nombre_completo: 'Administrador del Sistema',
        numero_empleado: 'ADMIN001',
        rol: 'admin',
        departamento: 'Sistemas',
        activo: true,
        created_at: now,
        updated_at: now
      }
    ];
    await queryInterface.bulkInsert('users', users, {
      ignoreDuplicates: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
