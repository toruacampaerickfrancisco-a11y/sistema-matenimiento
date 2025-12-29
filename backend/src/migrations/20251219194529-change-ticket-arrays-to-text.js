/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
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

  // Establecer valores por defecto
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
}

export async function down (queryInterface, Sequelize) {
  // Crear columnas temporales para arrays
  await queryInterface.addColumn('tickets', 'attachments_temp', {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    allowNull: true
  });

  await queryInterface.addColumn('tickets', 'tags_temp', {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    allowNull: true
  });

  // Convertir y copiar datos de vuelta a arrays
  await queryInterface.sequelize.query(`
    UPDATE tickets
    SET attachments_temp = CASE
        WHEN attachments::text = '[]' THEN ARRAY[]::text[]
        ELSE array_to_json(attachments::json)::text[]
      END,
        tags_temp = CASE
        WHEN tags::text = '[]' THEN ARRAY[]::text[]
        ELSE array_to_json(tags::json)::text[]
      END;
  `);

  // Eliminar columnas TEXT
  await queryInterface.removeColumn('tickets', 'attachments');
  await queryInterface.removeColumn('tickets', 'tags');

  // Renombrar columnas temporales
  await queryInterface.renameColumn('tickets', 'attachments_temp', 'attachments');
  await queryInterface.renameColumn('tickets', 'tags_temp', 'tags');

  // Establecer valores por defecto para arrays
  await queryInterface.changeColumn('tickets', 'attachments', {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    allowNull: true,
    defaultValue: []
  });

  await queryInterface.changeColumn('tickets', 'tags', {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    allowNull: true,
    defaultValue: []
  });
}
