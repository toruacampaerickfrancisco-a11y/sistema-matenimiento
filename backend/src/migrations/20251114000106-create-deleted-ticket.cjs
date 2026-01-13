module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('deleted_tickets', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('gen_random_uuid()'),
				primaryKey: true,
				allowNull: false
			},
			ticket_number: {
				type: Sequelize.STRING(20),
				allowNull: false,
			},
			title: {
				type: Sequelize.STRING(200),
				allowNull: false,
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			justification: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			deleted_by_id: {
				type: Sequelize.UUID,
				allowNull: true,
			},
			original_created_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			deleted_at: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
			}
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('deleted_tickets');
	}
};
