const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'vendor_signup_fields';

const VendorField = sequelize.define('VendorField', {
  first_name: {
    type: Sequelize.ENUM,
    values: ['yes', 'no'],
    defaultValue: 'yes',
  },
  last_name: {
    type: Sequelize.ENUM,
    values: ['yes', 'no'],
    defaultValue: 'yes',
  },
  middle_name: {
    type: Sequelize.ENUM,
    values: ['yes', 'no'],
    defaultValue: 'yes',
  },
  mobile_number: {
    type: Sequelize.ENUM,
    values: ['yes', 'no'],
    defaultValue: 'yes',
  },
  email: {
    type: Sequelize.ENUM,
    values: ['yes', 'no'],
    defaultValue: 'yes',
  },
  link: {
    type: Sequelize.ENUM,
    values: ['yes', 'no'],
    defaultValue: 'yes',
  },
  address: {
    type: Sequelize.ENUM,
    values: ['yes', 'no'],
    defaultValue: 'yes',
  },
  city: {
    type: Sequelize.ENUM,
    values: ['yes', 'no'],
    defaultValue: 'yes',
  },
  company_name: {
    type: Sequelize.ENUM,
    values: ['yes', 'no'],
    defaultValue: 'yes',
  },
  state: {
    type: Sequelize.ENUM,
    values: ['yes', 'no'],
    defaultValue: 'yes',
  },
  password: {
    type: Sequelize.ENUM,
    values: ['yes', 'no'],
    defaultValue: 'yes',
  },
}, {
  tableName,
});

// eslint-disable-next-line
VendorField.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = VendorField;
