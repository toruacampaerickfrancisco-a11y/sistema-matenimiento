/**
 * Migration for creating the 'equipment' table based on the Equipment model.
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('equipment', {
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
      type: {
        type: Sequelize.ENUM('desktop', 'laptop', 'printer', 'server', 'monitor', 'other'),
        allowNull: false
      },
      brand: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      model: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      serial_number: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      inventory_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      processor: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      ram: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      hard_drive: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      operating_system: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('available', 'assigned', 'maintenance', 'retired'),
        allowNull: false,
        defaultValue: 'available'
      },
      location: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      assigned_user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      purchase_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      warranty_expiration: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      purchase_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      requirement: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
    // Indexes
    await queryInterface.addIndex('equipment', ['serial_number'], { unique: true });
    await queryInterface.addIndex('equipment', ['inventory_number'], { unique: true });
    await queryInterface.addIndex('equipment', ['type']);
    await queryInterface.addIndex('equipment', ['status']);
    await queryInterface.addIndex('equipment', ['assigned_user_id']);
    await queryInterface.addIndex('equipment', ['brand', 'model']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('equipment');
    await queryInterface.sequelize.query("DROP TYPE IF EXISTS \"enum_equipment_type\"");
    await queryInterface.sequelize.query("DROP TYPE IF EXISTS \"enum_equipment_status\"");
  }
};