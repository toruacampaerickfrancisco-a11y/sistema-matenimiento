module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('ticket_comments', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('gen_random_uuid()'),
				primaryKey: true,
				allowNull: false
			},
			ticket_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
				  model: 'tickets',
				  key: 'id'
				}
			  },
			  created_by_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
				  model: 'users',
				  key: 'id'
				}
			  },
			  comment: {
				type: Sequelize.TEXT,
				allowNull: false
			  },
			  is_internal: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
				comment: 'true si es un comentario interno solo para técnicos'
			  },
			  attachments: {
				type: Sequelize.JSON,
				allowNull: true,
				defaultValue: []
			  }
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('ticket_comments');
	}
};
