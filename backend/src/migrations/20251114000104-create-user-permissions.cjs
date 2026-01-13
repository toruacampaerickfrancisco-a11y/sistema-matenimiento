module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('user_permissions', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('gen_random_uuid()'),
				primaryKey: true,
				allowNull: false
			},
			user_id: {
				type: Sequelize.UUID,
				allowNull: false,
			},
			permission_id: {
				type: Sequelize.UUID,
				allowNull: false,
			},
			granted_by_id: {
				type: Sequelize.UUID
			},
			granted_at: {
				type: Sequelize.TEXT,
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
			},
			expires_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
			},
			is_active: {
				type: Sequelize.BOOLEAN,
				defaultValue: true
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
			}
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('user_permissions');
	}
};
