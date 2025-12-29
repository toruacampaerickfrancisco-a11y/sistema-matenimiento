import { Equipment, User, Ticket, sequelize } from '../models/index.js';
import { Op } from 'sequelize';

const equipmentController = {
  async getAllEquipment(ctx) {
    try {
      const { page = 1, limit = 10, search, type, status, location } = ctx.query;
      const offset = (page - 1) * limit;
      
      const where = {};
      
      if (search) {
        // Mapeo de términos en español a valores en inglés para la búsqueda de tipo
        const term = search.toLowerCase();
        const extraTypeSearch = [];
        if (term.length > 2) {
          if ('impresora'.includes(term)) extraTypeSearch.push('printer');
          if ('computadora'.includes(term) || 'escritorio'.includes(term) || 'pc'.includes(term)) extraTypeSearch.push('desktop');
          if ('portatil'.includes(term) || 'laptop'.includes(term)) extraTypeSearch.push('laptop');
          if ('servidor'.includes(term)) extraTypeSearch.push('server');
          if ('monitor'.includes(term) || 'pantalla'.includes(term)) extraTypeSearch.push('monitor');
        }

        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { brand: { [Op.iLike]: `%${search}%` } },
          { model: { [Op.iLike]: `%${search}%` } },
          { serial_number: { [Op.iLike]: `%${search}%` } },
          { inventory_number: { [Op.iLike]: `%${search}%` } },
          { location: { [Op.iLike]: `%${search}%` } },
          { processor: { [Op.iLike]: `%${search}%` } },
          { ram: { [Op.iLike]: `%${search}%` } },
          { hard_drive: { [Op.iLike]: `%${search}%` } },
          { operating_system: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { notes: { [Op.iLike]: `%${search}%` } },
          { requirement: { [Op.iLike]: `%${search}%` } },
          { '$assignedUser.nombre_completo$': { [Op.iLike]: `%${search}%` } },
          { '$assignedUser.usuario$': { [Op.iLike]: `%${search}%` } },
          { '$assignedUser.correo$': { [Op.iLike]: `%${search}%` } },
          sequelize.where(sequelize.cast(sequelize.col('Equipment.type'), 'text'), { [Op.iLike]: `%${search}%` }),
          sequelize.where(sequelize.cast(sequelize.col('Equipment.status'), 'text'), { [Op.iLike]: `%${search}%` })
        ];

        if (extraTypeSearch.length > 0) {
          where[Op.or].push({ type: { [Op.in]: extraTypeSearch } });
        }
      }
      
      if (type) {
        // Normalizar tipos (aceptar mayúsculas desde frontend)
        where.type = type.toString().toLowerCase();
      }
      if (status) {
        // Normalizar estados para que coincidan con el enum en DB
        where.status = status.toString().toLowerCase();
      }
      if (location) where.location = location;

      console.log('Equipment Query Params:', { search, type, status, location });
      console.log('Equipment Where Clause:', JSON.stringify(where, null, 2));

      const { count, rows } = await Equipment.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'assignedUser'
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['updatedAt', 'DESC']],
        subQuery: false
      });

      ctx.body = { 
        success: true, 
        data: rows.map(e => (typeof e.toPublicJSON === 'function' ? e.toPublicJSON() : e.dataValues)),
        pagination: {
          total: count,
          page: parseInt(page),
          totalPages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      console.error('Error getting equipment:', error);
      ctx.status = 500;
      ctx.body = { success: false, message: 'Error al obtener equipos' };
    }
  },
  async getEquipmentById(ctx) {
    const equipment = await Equipment.findByPk(ctx.params.id);
    if (equipment) {
      ctx.body = { success: true, data: typeof equipment.toPublicJSON === 'function' ? equipment.toPublicJSON() : equipment.dataValues };
    } else {
      ctx.status = 404;
      ctx.body = { success: false, message: 'Equipo no encontrado' };
    }
  },

  async createEquipment(ctx) {
    try {
      const data = ctx.request.body;
      
      const requiredFields = {
        name: 'Nombre',
        type: 'Tipo',
        brand: 'Marca',
        model: 'Modelo',
        serialNumber: 'Número de Serie',
        inventoryNumber: 'Número de Inventario',
        status: 'Estado'
      };

      const missingFields = Object.keys(requiredFields).filter(field => !data[field]);

      if (missingFields.length > 0) {
        const missingFieldsMessage = missingFields.map(field => requiredFields[field]).join(', ');
        ctx.status = 400;
        ctx.body = { success: false, message: `Los siguientes campos son requeridos: ${missingFieldsMessage}` };
        return;
      }

      // Mapear campos del frontend al modelo de base de datos
      const equipmentData = {
        name: data.name,
        type: data.type,
        brand: data.brand,
        model: data.model,
        serial_number: data.serialNumber,
        inventory_number: data.inventoryNumber,
        status: data.status,
        location: data.location,
        purchase_date: data.purchaseDate,
        warranty_expiration: data.warrantyExpiration,
        description: data.description || data.notes,
        assigned_user_id: data.assignedUserId || null,
        processor: data.processor,
        ram: data.ram,
        hard_drive: data.hardDrive,
        operating_system: data.operatingSystem,
        notes: data.notes,
        requirement: data.requirement
      };

      const equipment = await Equipment.create(equipmentData);
      
      await equipment.reload({
        include: [{ model: User, as: 'assignedUser' }]
      });

      ctx.status = 201;
      ctx.body = { 
        success: true, 
        data: typeof equipment.toPublicJSON === 'function' ? equipment.toPublicJSON() : equipment 
      };
    } catch (error) {
      console.error('Error creating equipment:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        let fieldName = 'campo';
        let value = '';
        if (error.errors && error.errors.length > 0) {
          const field = error.errors[0].path;
          value = error.errors[0].value;
          fieldName = field === 'serial_number' ? 'Número de Serie' : 'Número de Inventario';
        } else if (error.parent && error.parent.constraint) {
          // Handle case where errors array is empty
          if (error.parent.constraint.includes('inventory_number')) {
            fieldName = 'Número de Inventario';
            value = error.parent.detail ? error.parent.detail.match(/\(([^)]+)\)=\(([^)]+)\)/)?.[2] || '' : '';
          } else if (error.parent.constraint.includes('serial_number')) {
            fieldName = 'Número de Serie';
            value = error.parent.detail ? error.parent.detail.match(/\(([^)]+)\)=\(([^)]+)\)/)?.[2] || '' : '';
          }
        }
        ctx.status = 409;
        ctx.body = { success: false, message: `El ${fieldName} '${value}' ya existe.` };
        return;
      }
      ctx.status = 500;
      ctx.body = { success: false, message: error.message || 'Error al crear equipo' };
    }
  },

  async updateEquipment(ctx) {
    try {
      const { id } = ctx.params;
      const data = ctx.request.body;
      
      const equipment = await Equipment.findByPk(id);
      
      if (!equipment) {
        ctx.status = 404;
        ctx.body = { success: false, message: 'Equipo no encontrado' };
        return;
      }

      const requiredFields = { name: 'Nombre', type: 'Tipo', brand: 'Marca', model: 'Modelo', serialNumber: 'Número de Serie', inventoryNumber: 'Número de Inventario', status: 'Estado' };
      for (const field in requiredFields) {
        if (data[field] !== undefined && (data[field] === null || data[field] === '')) {
          ctx.status = 400;
          ctx.body = { success: false, message: `El campo '${requiredFields[field]}' no puede ser vacío.` };
          return;
        }
      }
      
      const updateData = {
        name: data.name,
        type: data.type,
        brand: data.brand,
        model: data.model,
        serial_number: data.serialNumber,
        inventory_number: data.inventoryNumber,
        status: data.status,
        location: data.location,
        purchase_date: data.purchaseDate,
        warranty_expiration: data.warrantyExpiration,
        description: data.description || data.notes,
        processor: data.processor,
        ram: data.ram,
        hard_drive: data.hardDrive,
        operating_system: data.operatingSystem,
        notes: data.notes,
        requirement: data.requirement
      };
      
      if (data.assignedUserId !== undefined) {
        updateData.assigned_user_id = data.assignedUserId || null;
      }

      Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

      await equipment.update(updateData);
      
      await equipment.reload({
        include: [{ model: User, as: 'assignedUser' }]
      });

      ctx.body = { 
        success: true, 
        data: typeof equipment.toPublicJSON === 'function' ? equipment.toPublicJSON() : equipment 
      };
    } catch (error) {
      console.error('Error updating equipment:', error);
       if (error.name === 'SequelizeUniqueConstraintError') {
        const field = error.errors[0].path;
        const value = error.errors[0].value;
        const fieldName = field === 'serial_number' ? 'Número de Serie' : 'Número de Inventario';
        ctx.status = 409;
        ctx.body = { success: false, message: `El ${fieldName} '${value}' ya existe.` };
        return;
      }
      ctx.status = 500;
      ctx.body = { success: false, message: error.message || 'Error al actualizar equipo' };
    }
  },

  async deleteEquipment(ctx) {
    try {
      const { id } = ctx.params;
      const equipment = await Equipment.findByPk(id);
      
      if (!equipment) {
        ctx.status = 404;
        ctx.body = { success: false, message: 'Equipo no encontrado' };
        return;
      }

      // Desvincular tickets antes de eliminar
      await Ticket.update(
        { equipment_id: null },
        { where: { equipment_id: id } }
      );

      await equipment.destroy();
      ctx.status = 204;
    } catch (error) {
      console.error('Error deleting equipment:', error);
      ctx.status = 500;
      ctx.body = { success: false, message: 'Error al eliminar equipo' };
    }
  }
};

export default equipmentController;
