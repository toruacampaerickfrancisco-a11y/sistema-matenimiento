module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('departments', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('gen_random_uuid()'),
				primaryKey: true,
				allowNull: false
			},
			display_name: {
				type: Sequelize.STRING(200),
				allowNull: false,
			},
			is_active: {
				type: Sequelize.BOOLEAN,
				defaultValue: true
			}
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('departments');
	}
};
