const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'resources';

const Resource = sequelize.define('Resource', {
  user_id: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  resource_id: {
    type: Sequelize.STRING,
    unique: false,
  },
}, {
  tableName,
});

// eslint-disable-next-line
Resource.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Resource;
