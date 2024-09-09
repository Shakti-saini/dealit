const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'tem_cart';

const Temcart = sequelize.define('Temcart', {
  variant: {
    type: Sequelize.TEXT,
  },
  product_title: {
    type: Sequelize.STRING,
  },
  quantity: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  price: {
    type: Sequelize.FLOAT,
    unique: false,
  },
  shipping_amount: {
    type: Sequelize.FLOAT,
    unique: false,
  },
  tax_percent: {
    type: Sequelize.FLOAT,
    unique: false,
  },
  tax_amount: {
    type: Sequelize.FLOAT,
    unique: false,
  },
  total_amount: {
    type: Sequelize.FLOAT,
    unique: false,
  },
  product_sku: {
    type: Sequelize.STRING,
    unique: false,
  },
  type: {
    type: Sequelize.ENUM,
    values: ['cart', 'whislist'],
    defaultValue: 'cart',
  },
  status: {
    type: Sequelize.ENUM,
    values: ['active', 'completed', 'inactive'],
    defaultValue: 'active',
  },
}, {
  tableName,
});

// eslint-disable-next-line
Temcart.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Temcart;
