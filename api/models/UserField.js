const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'user_signup_fields';

const UserField = sequelize.define('UserField', {
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
  password: {
    type: Sequelize.ENUM,
    values: ['yes', 'no'],
    defaultValue: 'yes',
  },
}, {
  tableName,
});

// eslint-disable-next-line
UserField.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = UserField;
