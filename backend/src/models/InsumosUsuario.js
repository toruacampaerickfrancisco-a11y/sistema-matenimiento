import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class InsumosUsuario extends Model {}

InsumosUsuario.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  usuario_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  insumo_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  fecha_asignacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'InsumosUsuario',
  tableName: 'insumos_usuarios',
  underscored: true
});

export default InsumosUsuario;
