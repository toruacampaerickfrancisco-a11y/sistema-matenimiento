const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Crear Tabla Activities
    await queryInterface.createTable('Activities', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('todo', 'in_progress', 'review', 'done'),
        defaultValue: 'todo',
        allowNull: false
      },
      priority: {
        type: DataTypes.ENUM('urgent', 'high', 'normal', 'low'),
        defaultValue: 'normal',
        allowNull: false
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      visibility: {
        type: DataTypes.ENUM('private', 'team', 'public'),
        defaultValue: 'team',
        allowNull: false
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    // 2. Crear Tabla ActivityParticipants (Muchos a Muchos)
    await queryInterface.createTable('ActivityParticipants', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      activity_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Activities',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      role: {
        type: DataTypes.ENUM('owner', 'collaborator', 'watcher'),
        defaultValue: 'collaborator'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    // 3. Crear Tabla ActivityComments
    await queryInterface.createTable('ActivityComments', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      activity_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Activities',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ActivityComments');
    await queryInterface.dropTable('ActivityParticipants');
    await queryInterface.dropTable('Activities');
  }
};
