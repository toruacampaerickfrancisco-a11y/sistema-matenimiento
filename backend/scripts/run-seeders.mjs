import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { sequelize } from '../src/config/database.js';
import Sequelize from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const seedersDir = path.join(__dirname, '..', 'src', 'seeders');
  const files = await fs.readdir(seedersDir);
  const seederFiles = files
    .filter(f => f.endsWith('.cjs') || f.endsWith('.js') || f.endsWith('.mjs'))
    .sort();

  const queryInterface = sequelize.getQueryInterface();

  console.log('Conectando a la base de datos...');
  const ok = await sequelize.authenticate().then(() => true).catch(err => { console.error('Error conectando:', err); return false; });
  if (!ok) process.exit(1);

  // Intentar limpiar tablas en orden que evita violaciones de FK
  const preCleanTables = [
    'ticket_comments',
    'tickets',
    'deleted_tickets',
    'inventory_movements',
    'read_notifications',
    'user_permissions',
    'permissions',
    'insumos_usuarios',
    'insumos',
    'equipment',
    'users'
  ];
  try {
    for (const t of preCleanTables) {
      try {
        console.log(`Limpiando tabla (pre): ${t}`);
        await queryInterface.bulkDelete(t, null, {});
      } catch (e) {
        // Ignorar errores en pre-clean si la tabla no existe o no puede limpiarse
        console.warn(`No se pudo limpiar tabla ${t}: ${e.message}`);
      }
    }
  } catch (e) {
    console.warn('Error durante pre-clean:', e.message);
  }

  try {
    for (const file of seederFiles) {
      const fullPath = path.join(seedersDir, file);
      console.log(`Ejecutando seeder: ${file}`);
      const imported = await import(pathToFileURL(fullPath).href);
      const seeder = imported.default || imported;
      if (typeof seeder.up === 'function') {
        await seeder.up(queryInterface, Sequelize);
        console.log(`Seeder ${file} ejecutado correctamente.`);
      } else {
        console.warn(`El archivo ${file} no exporta una función 'up'. Se omitirá.`);
      }
    }
    console.log('Todos los seeders se ejecutaron correctamente.');
  } catch (err) {
    console.error('Error ejecutando seeders:', err);
    process.exitCode = 2;
  } finally {
    await sequelize.close();
  }
}

run();
