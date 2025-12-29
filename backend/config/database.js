import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Obtener __dirname compatible con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer configuración de sequelize-cli
const configPath = path.resolve(__dirname, './config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

let sequelize;

if (dbConfig.dialect === 'sqlite') {
  // Usar ruta absoluta para evitar problemas de contexto
  const storage = path.resolve(__dirname, '..', dbConfig.storage);
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage,
    logging: dbConfig.logging,
  });
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    ...dbConfig.dialectOptions
  });
}

export { sequelize };
