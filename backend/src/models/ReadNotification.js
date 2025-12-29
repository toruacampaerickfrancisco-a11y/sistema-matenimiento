import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const ReadNotification = sequelize.define('ReadNotification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  notification_id: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'read_notifications',
  timestamps: true,
  updatedAt: false 
});

export default ReadNotification;
