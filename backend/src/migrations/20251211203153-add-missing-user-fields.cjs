'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add ultimo_acceso column
    await queryInterface.addColumn('users', 'ultimo_acceso', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // Add foto_perfil column
    await queryInterface.addColumn('users', 'foto_perfil', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove the columns in reverse order
    await queryInterface.removeColumn('users', 'foto_perfil');
    await queryInterface.removeColumn('users', 'ultimo_acceso');
  }
};
