module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('permissions', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('gen_random_uuid()'),
				primaryKey: true,
				allowNull: false
			},
			name: {
				type: Sequelize.STRING(100),
				allowNull: false
			},
			module: {
				type: Sequelize.ENUM(
				  'dashboard', 
				  'users', 
				  'equipment', 
				  'tickets', 
				  'reports', 
				  'profile', 
				  'permissions',
				  'supplies'
				),
				allowNull: false
			  },
			  action: {
				type: Sequelize.ENUM(
				  'view', 
				  'create', 
				  'edit', 
				  'delete', 
				  'export', 
				  'assign'
				),
				allowNull: false
			  },
			  description: {
				type: Sequelize.STRING(255),
				allowNull: true
			  },
			  is_active: {
				type: Sequelize.BOOLEAN,
				defaultValue: true
			  }
		},{
			indexes: [
			  {
				unique: true,
				fields: ['module', 'action']
			  },
			  {
				fields: ['module']
			  },
			  {
				fields: ['action']
			  },
			  {
				fields: ['is_active']
			  }
			]
		});
	},
	
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('permissions');
	}
};
