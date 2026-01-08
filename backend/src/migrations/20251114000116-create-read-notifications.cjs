module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('read_notifications', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('gen_random_uuid()'),
				primaryKey: true,
				allowNull: false
			},
			user_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
				  model: 'users',
				  key: 'id'
				}
			  },
			  notification_id: {
				type: Sequelize.STRING,
				allowNull: false
			  }
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('read_notifications');
	}
};
