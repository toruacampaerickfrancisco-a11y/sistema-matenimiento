module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('insumos_usuarios', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('gen_random_uuid()'),
				primaryKey: true,
				allowNull: false
			},
			usuario_id: {
				type: Sequelize.UUID,
				allowNull: false
			  },
			  insumo_id: {
				type: Sequelize.UUID,
				allowNull: false
			  },
			  cantidad: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0
			  },
			  fecha_asignacion: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
			  }
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('insumos_usuarios');
	}
};
