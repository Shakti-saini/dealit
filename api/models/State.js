const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'states';

const State = sequelize.define('State', {
  name: {
    type: Sequelize.STRING,
  },
  country_id: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  country_code: {
    type: Sequelize.STRING,
  },
  iso2: {
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
State.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = State;
