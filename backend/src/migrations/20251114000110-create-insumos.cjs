module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('insumos', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('gen_random_uuid()'),
				primaryKey: true,
				allowNull: false
			},
			nombre: {
				type: Sequelize.STRING(100),
				allowNull: false
			  },
			  descripcion: {
				type: Sequelize.STRING(255)
			  },
			  cantidad: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0
			  },
			  unidad: {
				type: Sequelize.STRING(50)
			  },
			  ubicacion: {
				type: Sequelize.STRING(100)
			  },
			  fecha_ingreso: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
			  },
			  last_entry: {
				type: Sequelize.DATE,
				allowNull: true
			  },
			  last_exit: {
				type: Sequelize.DATE,
				allowNull: true
			  },
			  activo: {
				type: Sequelize.BOOLEAN,
				defaultValue: true
			  }
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('insumos');
	}
};
