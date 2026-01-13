module.exports = {
    development: {
    username: "postgres",
    password: "Admin123+",
    database: "sistema-mantenimientoDB",
    host: "localhost",
    port: 5432,
    dialect: "postgres",
    logging: true
    },
    test: {
      username: "postgres",
      password: "password",
      database: "mi_bd_test",
      host: "127.0.0.1",
      dialect: "postgres"
    },
    production: {
      username: "postgres",
      password: "password",
      database: "mi_bd_prod",
      host: "127.0.0.1",
      dialect: "postgres"
    }
  };