const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'address';

const Address = sequelize.define('Address', {
  first_name: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  last_name: {
    type: Sequelize.TEXT,
  },
  gender: {
    type: Sequelize.STRING,
    unique: false,
  },
  phone: {
    type: Sequelize.STRING,
    unique: false,
  },
  phone_alt: {
    type: Sequelize.STRING,
    unique: false,
  },
  address: {
    type: Sequelize.STRING,
    unique: false,
  },
  landmark: {
    type: Sequelize.STRING,
    unique: false,
  },
  region: {
    type: Sequelize.STRING,
    unique: false,
  },
  city: {
    type: Sequelize.STRING,
    unique: false,
  },
  state: {
    type: Sequelize.STRING,
    unique: false,
  },
  country: {
    type: Sequelize.STRING,
    unique: false,
  },
  zipcode: {
    type: Sequelize.STRING,
    unique: false,
  },
  type: {
    type: Sequelize.ENUM,
    values: ['home', 'office'],
    defaultValue: 'home',
  },
  status: {
    type: Sequelize.ENUM,
    values: ['active', 'inactive'],
    defaultValue: 'active',
  },
}, {
  tableName,
});

// eslint-disable-next-line
Address.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Address;
