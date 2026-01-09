import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
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
    defaultValue: 'todo'
  },
  priority: {
    type: DataTypes.ENUM('urgent', 'high', 'normal', 'low'),
    defaultValue: 'normal'
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ticket_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  visibility: {
    type: DataTypes.ENUM('private', 'team', 'public'),
    defaultValue: 'team'
  },
  ticket_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'tickets',
      key: 'id'
    }
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'Activities',
  timestamps: true
});

Activity.associate = (models) => {
  Activity.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
  Activity.belongsTo(models.Ticket, { foreignKey: 'ticket_id', as: 'ticket' });
  Activity.hasMany(models.ActivityParticipant, { foreignKey: 'activity_id', as: 'participants' });
  Activity.hasMany(models.ActivityComment, { foreignKey: 'activity_id', as: 'comments' });
};

export default Activity;
