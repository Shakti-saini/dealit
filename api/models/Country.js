const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'countries';

const Country = sequelize.define('Country', {
  name: {
    type: Sequelize.STRING,
  },
  numeric_code: {
    type: Sequelize.STRING,
  },
  iso3: {
    type: Sequelize.STRING,
  },
  iso2: {
    type: Sequelize.STRING,
  },
  currency_name: {
    type: Sequelize.STRING,
  },
  currency_symbol: {
    type: Sequelize.STRING,
  },
  latitude: {
    type: Sequelize.STRING,
  },
  longitude: {
    type: Sequelize.STRING,
  },
  continent_code: {
    type: Sequelize.STRING,
  },
}, {
  tableName,
});

// eslint-disable-next-line
Country.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Country;
