const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'continents';

const Continent = sequelize.define('Continent', {
  code: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
}, {
  tableName,
  timestamps: false,
});

// eslint-disable-next-line
Continent.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Continent;
