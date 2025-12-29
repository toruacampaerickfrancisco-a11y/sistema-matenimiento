import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class UserPermission extends Model {
  // Método para verificar si el permiso está activo y no expirado
  isValid() {
    if (!this.is_active) return false;
    if (this.expires_at && new Date() > new Date(this.expires_at)) return false;
    return true;
  }

  // Asociaciones estáticas
  static associate(models) {
    // Un UserPermission pertenece a un usuario
    UserPermission.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    // Un UserPermission pertenece a un permiso
    UserPermission.belongsTo(models.Permission, {
      foreignKey: 'permission_id',
      as: 'permission'
    });

    // Un UserPermission fue otorgado por un usuario (admin)
    UserPermission.belongsTo(models.User, {
      foreignKey: 'granted_by_id',
      as: 'grantedBy'
    });
  }
}

// Definir el modelo UserPermission
UserPermission.init({
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
  permission_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'permissions',
      key: 'id'
    }
  },
  granted_by_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  granted_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'UserPermission',
  tableName: 'user_permissions',
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'permission_id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['permission_id']
    },
    {
      fields: ['granted_by_id']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['expires_at']
    }
  ]
});

export default UserPermission;