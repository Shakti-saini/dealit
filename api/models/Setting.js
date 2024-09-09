const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'settings';

const Setting = sequelize.define('Setting', {
  meta_key: {
    type: Sequelize.STRING,
    unique: false,
  },
  meta_value: {
    type: Sequelize.TEXT,
    unique: false,
  },
}, {
  tableName,
});

// eslint-disable-next-line
Setting.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Setting;
