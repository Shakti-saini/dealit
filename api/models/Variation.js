const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'variations';

const Variation = sequelize.define('Variation', {
  name: {
    type: Sequelize.STRING,
    unique: false,
  },
  product_id: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  quantity: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  mrp: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  offer_price: {
    type: Sequelize.INTEGER,
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
Variation.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Variation;
