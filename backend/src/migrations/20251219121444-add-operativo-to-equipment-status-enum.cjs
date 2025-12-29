'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add 'operativo' to the enum_equipment_status enum
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_equipment_status" ADD VALUE 'operativo';
    `);
  },

  async down (queryInterface, Sequelize) {
    // Note: PostgreSQL doesn't support removing values from enums directly
    // This migration is irreversible
    throw new Error('Cannot remove enum value. This migration is irreversible.');
  }
};