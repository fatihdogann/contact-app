const { Sequelize } = require('sequelize');

// Environment variables for database connection
// In Plesk, DB credentials might be provided differently
const dbName = process.env.DB_NAME || process.env.MYSQL_DATABASE || 'contact_db';
const dbUser = process.env.DB_USER || process.env.MYSQL_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '';
const dbHost = process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost';
const dbPort = process.env.DB_PORT || process.env.MYSQL_PORT || 3306;

const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
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

module.exports = sequelize;