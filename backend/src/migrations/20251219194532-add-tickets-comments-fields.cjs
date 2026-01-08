'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add ultimo_acceso column
    await queryInterface.addColumn('ticket_comments', 'created_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove the columns in reverse order
    await queryInterface.removeColumn('ticket_comments', 'created_at');
  }
};
