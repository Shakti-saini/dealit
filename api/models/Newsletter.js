const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'newsletters';

const Newsletter = sequelize.define('Newsletter', {
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  gender: {
    type: Sequelize.STRING,
    unique: false,
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
Newsletter.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Newsletter;
