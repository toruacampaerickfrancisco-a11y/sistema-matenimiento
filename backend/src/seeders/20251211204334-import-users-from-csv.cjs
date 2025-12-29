// Seeder para importar usuarios desde CSV
'use strict';
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];
    const now = new Date();

    // Leer el archivo CSV
    const csvPath = path.join(__dirname, '../csv/users_valid.csv');

    // Procesar el CSV de manera síncrona
    const rows = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          rows.push(row);
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    // Procesar cada fila
    for (const row of rows) {
      // El CSV viene con índices numéricos, mapearlos a los nombres de campos
      const mappedRow = {
        numero_empleado: row._0,
        usuario: row._1,
        correo: row._2,
        contrasena: row._3,
        dependencia: row._4,
        departamento: row._5,
        rol: row._6,
        cargo: row._7,
        area: row._8,
        creado_por: row._9,
        nombre_completo: row._10,
        activo: row._11,
        ultimo_acceso: row._12,
        foto_perfil: row._13
      };

      // Filtrar usuarios con datos faltantes críticos
      if (mappedRow.usuario === 'Faltan Datos' ||
          mappedRow.correo === 'Faltan Datos' ||
          mappedRow.usuario === 'usuario' || // Saltar la fila de headers
          !mappedRow.usuario ||
          mappedRow.usuario.trim() === '') {
        continue; // Saltar este registro
      }

      // Si la contraseña es "Faltan Datos", asignar una contraseña por defecto
      let contrasena = mappedRow.contrasena;
      if (contrasena === 'Faltan Datos' || !contrasena || contrasena.trim() === '') {
        contrasena = 'TempPass2025'; // Contraseña temporal
      }

      // Convertir rol
      let rol = mappedRow.rol;
      if (rol === 'Admin') {
        rol = 'admin';
      } else if (rol === 'user') {
        rol = 'usuario';
      }

      // Convertir activo a boolean
      const activo = mappedRow.activo === '1' || mappedRow.activo === 'true';

      // Verificar si el usuario ya existe (por usuario o correo). Si existe, no sobrescribir.
      const existingRows = await queryInterface.sequelize.query(
        'SELECT id FROM users WHERE usuario = :usuario OR correo = :correo LIMIT 1',
        {
          replacements: { usuario: mappedRow.usuario, correo: mappedRow.correo },
          type: Sequelize.QueryTypes.SELECT
        }
      );

      if (existingRows && existingRows.length > 0) {
        console.log(`Omitiendo usuario existente: ${mappedRow.usuario} / ${mappedRow.correo}`);
        continue;
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(contrasena, 10);

      const user = {
        id: uuidv4(),
        numero_empleado: mappedRow.numero_empleado || null,
        usuario: mappedRow.usuario,
        correo: mappedRow.correo,
        contrasena: hashedPassword,
        dependencia: mappedRow.dependencia || null,
        departamento: mappedRow.departamento || null,
        rol: rol || 'usuario',
        cargo: mappedRow.cargo || null,
        area: mappedRow.area || null,
        creado_por: mappedRow.creado_por || null,
        nombre_completo: mappedRow.nombre_completo || null,
        activo: activo,
        ultimo_acceso: mappedRow.ultimo_acceso ? new Date(mappedRow.ultimo_acceso) : null,
        foto_perfil: mappedRow.foto_perfil || null,
        created_at: now,
        updated_at: now
      };

      users.push(user);
    }

    if (users.length > 0) {
      await queryInterface.bulkInsert('users', users, {});
      console.log(`Se importaron ${users.length} usuarios desde el CSV`);
    } else {
      console.log('No se encontraron usuarios válidos para importar');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Solo eliminar los usuarios que no sean el admin por defecto
    await queryInterface.bulkDelete('users', {
      usuario: {
        [Sequelize.Op.ne]: 'admin'
      }
    }, {});
  }
};
