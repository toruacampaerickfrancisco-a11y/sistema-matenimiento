'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add ultimo_acceso column
    await queryInterface.addColumn('permissions', 'created_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('permissions', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove the columns in reverse order
    await queryInterface.removeColumn('permissions', 'created_at');
    await queryInterface.removeColumn('permissions', 'updated_at');
  }
};
