const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'cities';

const City = sequelize.define('City', {
  name: {
    type: Sequelize.STRING,
  },
  state_id: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  state_code: {
    type: Sequelize.STRING,
  },
  country_id: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  country_code: {
    type: Sequelize.STRING,
  },
  latitude: {
    type: Sequelize.STRING,
  },
  longitude: {
    type: Sequelize.STRING,
  },
}, {
  tableName,
});

// eslint-disable-next-line
City.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = City;
