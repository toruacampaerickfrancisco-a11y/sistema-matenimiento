import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class InventoryMovement extends Model {
  static associate(models) {
    InventoryMovement.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    // We don't have a hard relation to Insumo because Insumo might not be in the models export yet or circular dependency
    // But logically it belongs to Insumo
  }
}

InventoryMovement.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  insumo_id: {
    type: DataTypes.UUID, // Assuming Insumo uses UUID
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID, // User uses UUID
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('TICKET', 'MANUAL', 'INITIAL', 'ADJUSTMENT'),
    defaultValue: 'MANUAL'
  },
  reference_id: {
    type: DataTypes.STRING, // Can be Ticket UUID or ID
    allowNull: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'InventoryMovement',
  tableName: 'inventory_movements',
  underscored: true
});

export default InventoryMovement;
