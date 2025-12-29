// Seeder para insumos de ejemplo
'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const insumos = [
      {
        id: uuidv4(),
        nombre: 'Toner HP CE285A',
        descripcion: 'Toner negro para impresora HP LaserJet Pro M182nw',
        cantidad: 15,
        unidad: 'unidades',
        ubicacion: 'Almacén de Consumibles',
        fecha_ingreso: now,
        activo: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        nombre: 'Disco Duro SSD 240GB',
        descripcion: 'Disco sólido de estado de 240GB para reemplazo',
        cantidad: 8,
        unidad: 'unidades',
        ubicacion: 'Almacén de Hardware',
        fecha_ingreso: now,
        activo: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        nombre: 'Memoria RAM DDR4 8GB',
        descripcion: 'Módulo de memoria RAM DDR4 de 8GB',
        cantidad: 12,
        unidad: 'unidades',
        ubicacion: 'Almacén de Hardware',
        fecha_ingreso: now,
        activo: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        nombre: 'Cable HDMI 2m',
        descripcion: 'Cable HDMI de alta velocidad de 2 metros',
        cantidad: 25,
        unidad: 'unidades',
        ubicacion: 'Almacén de Cables',
        fecha_ingreso: now,
        activo: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        nombre: 'Teclado USB',
        descripcion: 'Teclado USB estándar para computadoras',
        cantidad: 20,
        unidad: 'unidades',
        ubicacion: 'Almacén de Periféricos',
        fecha_ingreso: now,
        activo: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        nombre: 'Mouse óptico USB',
        descripcion: 'Mouse óptico USB ergonómico',
        cantidad: 18,
        unidad: 'unidades',
        ubicacion: 'Almacén de Periféricos',
        fecha_ingreso: now,
        activo: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        nombre: 'Licencia Bitdefender Antivirus',
        descripcion: 'Licencia anual para antivirus Bitdefender',
        cantidad: 50,
        unidad: 'licencias',
        ubicacion: 'Sistema de Licencias',
        fecha_ingreso: now,
        activo: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        nombre: 'Monitor LCD 22"',
        descripcion: 'Monitor LCD de 22 pulgadas Full HD',
        cantidad: 6,
        unidad: 'unidades',
        ubicacion: 'Almacén de Hardware',
        fecha_ingreso: now,
        activo: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        nombre: 'Cinta adhesiva',
        descripcion: 'Cinta adhesiva transparente de oficina',
        cantidad: 30,
        unidad: 'rollos',
        ubicacion: 'Almacén de Oficina',
        fecha_ingreso: now,
        activo: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        nombre: 'Papel bond A4',
        descripcion: 'Resma de papel bond tamaño carta 75g',
        cantidad: 100,
        unidad: 'resmas',
        ubicacion: 'Almacén de Oficina',
        fecha_ingreso: now,
        activo: true,
        created_at: now,
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert('insumos', insumos, {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('insumos', null, {});
  }
};