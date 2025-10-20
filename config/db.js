const { Sequelize } = require('sequelize');
const path = require('path');

// Environment variables for database connection
const dbName = process.env.DB_NAME || process.env.MYSQL_DATABASE || 'contact_db';
const dbUser = process.env.DB_USER || process.env.MYSQL_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '';
const dbHost = process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost';
const dbPort = process.env.DB_PORT || process.env.MYSQL_PORT || 3306;
const dbDialect = process.env.DB_DIALECT || 'sqlite'; // default to sqlite
const dbStorage = process.env.DB_STORAGE || './data/database.sqlite'; // for sqlite

let sequelize;

if (dbDialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../', dbStorage),
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  });
} else {
  sequelize = new Sequelize(
    dbName,
    dbUser,
    dbPassword,
    {
      host: dbHost,
      port: dbPort,
      dialect: dbDialect,
      logging: process.env.NODE_ENV === 'development' ? console.log : false, // Disable logging in production
      dialectOptions: {
        // For Plesk environments, you might need SSL options
        ...(process.env.DB_SSL === 'true' && { ssl: { require: true, rejectUnauthorized: false } })
      },
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

module.exports = sequelize;