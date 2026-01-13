module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('tickets', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('gen_random_uuid()'),
				primaryKey: true,
				allowNull: false
			},
			ticket_number: {
				type: Sequelize.STRING(20),
				allowNull: false,
				unique: true
			  },
			  title: {
				type: Sequelize.STRING(200),
				allowNull: false
			  },
			  description: {
				type: Sequelize.TEXT,
				allowNull: false
			  },
			  status: {
				type: Sequelize.ENUM('nuevo', 'en_proceso', 'cerrado', 'pendiente'),
				allowNull: false,
				defaultValue: 'nuevo'
			  },
			  priority: {
				type: Sequelize.ENUM('sin_clasificar', 'baja', 'media', 'alta', 'critica'),
				allowNull: false,
				defaultValue: 'sin_clasificar'
			  },
			  service_type: {
				type: Sequelize.ENUM('preventivo', 'correctivo', 'instalacion'),
				allowNull: false,
				defaultValue: 'correctivo'
			  },
			  reported_by_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
				  model: 'users',
				  key: 'id'
				}
			  },
			  assigned_to_id: {
				type: Sequelize.UUID,
				allowNull: true,
				references: {
				  model: 'users',
				  key: 'id'
				}
			  },
			  equipment_id: {
				type: Sequelize.UUID,
				allowNull: true,
				references: {
				  model: 'equipment',
				  key: 'id'
				}
			  },
			  diagnosis: {
				type: Sequelize.TEXT,
				allowNull: true
			  },
			  solution: {
				type: Sequelize.TEXT,
				allowNull: true
			  },
			  parts: {
				type: Sequelize.TEXT,
				allowNull: true,
				defaultValue: '[]'
			  },
			  notes: {
				type: Sequelize.TEXT,
				allowNull: true
			  },
			  assigned_at: {
				type: Sequelize.DATE,
				allowNull: true
			  },
			  started_at: {
				type: Sequelize.DATE,
				allowNull: true
			  },
			  resolved_at: {
				type: Sequelize.DATE,
				allowNull: true
			  },
			  estimated_hours: {
				type: Sequelize.INTEGER,
				allowNull: true
			  },
			  actual_hours: {
				type: Sequelize.DECIMAL(5, 2),
				allowNull: true
			  },
			  cost: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: true
			  },
			  attachments: {
				type: Sequelize.TEXT,
				allowNull: true,
				defaultValue: '[]'
			  },
			  tags: {
				type: Sequelize.TEXT,
				allowNull: true,
				defaultValue: '[]'
			  }
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('tickets');
	}
};
