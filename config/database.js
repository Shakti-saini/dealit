const Sequelize = require('sequelize');
const path = require('path');

const connection = require('./connection');

console.log(process.env.NODE_ENV, 'process.env.NODE_ENV');
let database;
switch (process.env.NODE_ENV) {
  case 'production':
    database = new Sequelize(
      connection.production.database,
      connection.production.username,
      connection.production.password, {
        host: connection.production.host,
        dialect: connection.production.dialect,
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
        },
        logging: false,
      },
    );
    break;
  case 'testing':
    database = new Sequelize(
      connection.testing.database,
      connection.testing.username,
      connection.testing.password, {
        host: connection.testing.host,
        dialect: connection.testing.dialect,
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
        },
        logging: false,
      },
    );
    break;
  default:
    console.log(connection.development.username, connection.development.password);
    database = new Sequelize(
      connection.development.database,
      connection.development.username,
      connection.development.password, {
        host: connection.development.host,
        dialect: connection.development.dialect,
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
        },
        storage: path.join(process.cwd(), 'db', 'database.sqlite'),
        logging: false,
      },
    );
}

module.exports = database;
