const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'shipping_rates';

const ShippingRate = sequelize.define('ShippingRate', {
  product_id: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  country_id: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  amount1: {
    type: Sequelize.STRING,
    unique: false,
  },
  amount2: {
    type: Sequelize.STRING,
    unique: false,
  },
  amount3: {
    type: Sequelize.STRING,
    unique: false,
  },
  amount4: {
    type: Sequelize.STRING,
    unique: false,
  },
}, {
  tableName,
});

// eslint-disable-next-line
ShippingRate.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = ShippingRate;
