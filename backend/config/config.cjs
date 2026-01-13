const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "Admin123+",
    database: process.env.DB_NAME || "sistema-mantenimientoDB",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: true
  },
  test: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME_TEST || "mi_bd_test",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
    logging: false
  },
  production: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD, // En prod es obligatorio
    database: process.env.DB_NAME || "sistema-mantenimientoDB",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};