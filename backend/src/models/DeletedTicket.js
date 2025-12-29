import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class DeletedTicket extends Model {
  static associate(models) {
    DeletedTicket.belongsTo(models.User, {
      foreignKey: 'deleted_by_id',
      as: 'deletedBy'
    });
  }
}

DeletedTicket.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  ticket_number: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  justification: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  deleted_by_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  original_created_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  deleted_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'DeletedTicket',
  tableName: 'deleted_tickets',
  timestamps: false
});

export default DeletedTicket;
