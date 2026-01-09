import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const ActivityParticipant = sequelize.define('ActivityParticipant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  activity_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('owner', 'collaborator', 'watcher'),
    defaultValue: 'collaborator'
  }
}, {
  tableName: 'ActivityParticipants',
  timestamps: true
});

ActivityParticipant.associate = (models) => {
  ActivityParticipant.belongsTo(models.Activity, { foreignKey: 'activity_id' });
  ActivityParticipant.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};

export default ActivityParticipant;
