/**
 * Sequelize migration template (proposal) to add `department_id` to `users`.
 * This file is a template only — do not run it automatically. Review and run in staging first.
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'department_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'departments',
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'department_id');
  }
};
