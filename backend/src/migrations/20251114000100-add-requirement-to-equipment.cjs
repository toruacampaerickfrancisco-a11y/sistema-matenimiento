/**
 * Migration to add the 'requirement' column to the 'equipment' table.
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('equipment', 'requirement', {
        type: Sequelize.STRING,
        allowNull: true
      });
    } catch (error) {
      if (error.original && error.original.code === '42701') { // Postgres code for duplicate column
        console.log('Column requirement already exists in equipment table. Skipping.');
      } else {
        throw error;
      }
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('equipment', 'requirement');
  }
};
