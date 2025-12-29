'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add 'computadora' to the enum_equipment_type enum
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_equipment_type" ADD VALUE 'computadora';
    `);
  },

  async down (queryInterface, Sequelize) {
    // Note: PostgreSQL doesn't support removing values from enums directly
    // This migration is irreversible
    throw new Error('Cannot remove enum value. This migration is irreversible.');
  }
};