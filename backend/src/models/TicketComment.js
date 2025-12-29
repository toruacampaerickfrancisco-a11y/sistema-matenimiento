import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class TicketComment extends Model {
  // Asociaciones estáticas
  static associate(models) {
    // Un comentario pertenece a un ticket
    TicketComment.belongsTo(models.Ticket, {
      foreignKey: 'ticket_id',
      as: 'ticket'
    });

    // Un comentario pertenece a un usuario
    TicketComment.belongsTo(models.User, {
      foreignKey: 'created_by_id',
      as: 'createdBy'
    });
  }
}

// Definir el modelo TicketComment
TicketComment.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  ticket_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tickets',
      key: 'id'
    }
  },
  created_by_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 1000]
    }
  },
  is_internal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'true si es un comentario interno solo para técnicos'
  },
  attachments: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  }
}, {
  sequelize,
  modelName: 'TicketComment',
  tableName: 'ticket_comments',
  indexes: [
    {
      fields: ['ticket_id']
    },
    {
      fields: ['created_by_id']
    },
    {
      fields: ['created_at']
    },
    {
      fields: ['is_internal']
    }
  ]
});

export default TicketComment;