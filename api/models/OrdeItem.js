const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'order-items';

const OrderItem = sequelize.define('OrderItem', {
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
  cancel_reason: {
    type: Sequelize.STRING,
    unique: false,
  },
  cancel_by: {
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
OrderItem.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = OrderItem;
