import { Permission } from '../models/index.js';
import { Op } from 'sequelize';

const permissionController = {
  getAllPermissions: async (ctx) => {
    try {
      const { module, search } = ctx.query;
      const where = {};
      
      if (module) {
        where.module = module;
      }

      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { module: { [Op.iLike]: `%${search}%` } },
          { action: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const permissions = await Permission.findAll({
        where,
        order: [['module', 'ASC'], ['name', 'ASC']]
      });

      ctx.body = {
        success: true,
        data: permissions
      };
    } catch (error) {
      console.error('Error al obtener permisos:', error);
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: 'Error al obtener la lista de permisos'
      };
    }
  }
};

export default permissionController;
