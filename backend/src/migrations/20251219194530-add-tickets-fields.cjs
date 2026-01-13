'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Add ultimo_acceso column
      await queryInterface.addColumn('tickets', 'created_at', {
        type: Sequelize.DATE,
        allowNull: true
      });
    } catch (error) {
      if (error.original && error.original.code === '42701') {
        console.log('Column created_at already exists in tickets. Skipping.');
      } else {
        throw error;
      }
    }
  },

  async down (queryInterface, Sequelize) {
    // Remove the columns in reverse order
    await queryInterface.removeColumn('tickets', 'created_at');
  }
};
