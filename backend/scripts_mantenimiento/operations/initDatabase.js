import { sequelize, syncDatabase } from '../../src/config/database.js';
// import { seedDatabase } from './seeders/initialData.js';

// Función para inicializar completamente la base de datos
async function initializeDatabase() {
  try {
    console.log('🔄 Inicializando base de datos SQLite...');
    
    // Sincronizar modelos (crear tablas)
    await syncDatabase(true); // true = recrear tablas
    
    console.log('✅ Tablas creadas correctamente');
    
    // Poblar con datos iniciales
    // await seedDatabase();
    
    console.log('✅ Tablas creadas correctamente (sin datos iniciales)');
    
  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(() => {
      console.log('🎉 Inicialización completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

export { initializeDatabase };