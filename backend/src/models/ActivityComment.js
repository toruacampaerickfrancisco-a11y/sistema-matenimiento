import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const ActivityComment = sequelize.define('ActivityComment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  activity_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'ActivityComments',
  timestamps: true
});

ActivityComment.associate = (models) => {
  ActivityComment.belongsTo(models.Activity, { foreignKey: 'activity_id' });
  ActivityComment.belongsTo(models.User, { foreignKey: 'user_id', as: 'author' });
};

export default ActivityComment;
