import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Insumo extends Model {}

Insumo.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING(255)
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  unidad: {
    type: DataTypes.STRING(50)
  },
  ubicacion: {
    type: DataTypes.STRING(100)
  },
  fecha_ingreso: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  last_entry: {
    type: DataTypes.DATE,
    allowNull: true
  },
  last_exit: {
    type: DataTypes.DATE,
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Insumo',
  tableName: 'insumos',
  underscored: true
});

export default Insumo;
