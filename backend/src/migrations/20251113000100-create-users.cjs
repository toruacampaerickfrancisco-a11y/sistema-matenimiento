module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('users', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('gen_random_uuid()'),
				primaryKey: true,
				allowNull: false
			},
			numero_empleado: {
				type: Sequelize.STRING(20),
				allowNull: false,
				unique: true
			},
			usuario: {
				type: Sequelize.STRING(50),
				allowNull: false,
				unique: true
			},
			correo: {
				type: Sequelize.STRING(100),
				allowNull: false,
				unique: true
			},
			contrasena: {
				type: Sequelize.STRING,
				allowNull: false
			},
			dependencia: {
				type: Sequelize.STRING(100)
			},
			departamento: {
				type: Sequelize.STRING(100)
			},
			rol: {
				type: Sequelize.STRING(20)
			},
			cargo: {
				type: Sequelize.STRING(100)
			},
			area: {
				type: Sequelize.STRING(100)
			},
			creado_por: {
				type: Sequelize.STRING(20)
			},
			nombre_completo: {
				type: Sequelize.STRING(100)
			},
			activo: {
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
		await queryInterface.dropTable('users');
	}
};
