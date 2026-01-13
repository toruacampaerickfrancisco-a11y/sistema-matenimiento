/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Crear columnas temporales
    await queryInterface.addColumn('tickets', 'attachments_temp', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('tickets', 'tags_temp', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    // Convertir y copiar datos a columnas temporales
    await queryInterface.sequelize.query(`
      UPDATE tickets
      SET attachments_temp = COALESCE(array_to_json(attachments)::text, '[]'),
          tags_temp = COALESCE(array_to_json(tags)::text, '[]');
    `);

    // Eliminar columnas antiguas
    await queryInterface.removeColumn('tickets', 'attachments');
    await queryInterface.removeColumn('tickets', 'tags');

    // Renombrar columnas temporales
    await queryInterface.renameColumn('tickets', 'attachments_temp', 'attachments');
    await queryInterface.renameColumn('tickets', 'tags_temp', 'tags');

    // Establecer valores por defecto (si es necesario)
    await queryInterface.changeColumn('tickets', 'attachments', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: '[]'
    });

    await queryInterface.changeColumn('tickets', 'tags', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: '[]'
    });
  },

  async down (queryInterface, Sequelize) {
    // Revertir es complejo porque pasamos de TEXT a ARRAY
    // Para simplificar en producción, podriamos omitir o hacer lo opuesto
    // Por ahora dejaremos el down básico que revierta la estructura 
    // pero sin conversión de datos compleja si no se requiere.
    
    await queryInterface.removeColumn('tickets', 'attachments');
    await queryInterface.removeColumn('tickets', 'tags');
    
    // Volver a crear como arrays (vacíos por seguridad)
    await queryInterface.addColumn('tickets', 'attachments', {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true
    });
    
    await queryInterface.addColumn('tickets', 'tags', {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true
    });
  }
};
