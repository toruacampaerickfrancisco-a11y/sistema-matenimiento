'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const columns = ['created_at', 'updated_at'];
    for (const column of columns) {
      try {
        await queryInterface.addColumn('permissions', column, {
          type: Sequelize.DATE,
          allowNull: true
        });
      } catch (error) {
        if (error.original && error.original.code === '42701') {
          console.log(`Column ${column} already exists in permissions. Skipping.`);
        } else {
          throw error;
        }
      }
    }
  },

  async down (queryInterface, Sequelize) {
    // Remove the columns in reverse order
    await queryInterface.removeColumn('permissions', 'created_at');
    await queryInterface.removeColumn('permissions', 'updated_at');
  }
};
