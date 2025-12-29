/**
 * Migration to add the 'requirement' column to the 'equipment' table.
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('equipment', 'requirement', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('equipment', 'requirement');
  }
};
