"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear tipo ENUM para 'type' en Postgres (si no existe)
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query(
        "DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_inventory_movements_type') THEN CREATE TYPE \"enum_inventory_movements_type\" AS ENUM('TICKET','MANUAL','INITIAL','ADJUSTMENT'); END IF; END $$;"
      );
    }

    await queryInterface.createTable('inventory_movements', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('(gen_random_uuid())'),
        allowNull: false,
        primaryKey: true
      },
      insumo_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      type: {
        type: queryInterface.sequelize.getDialect() === 'postgres' ? Sequelize.ENUM('TICKET','MANUAL','INITIAL','ADJUSTMENT') : Sequelize.STRING,
        allowNull: false,
        defaultValue: 'MANUAL'
      },
      reference_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('inventory_movements');

    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_inventory_movements_type";');
    }
  }
};
